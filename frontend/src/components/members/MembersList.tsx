import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Alert,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupIcon from '@mui/icons-material/Group';
import {
  useMembersControllerFindAll,
  useMembersControllerRemove,
  useMembersControllerLeave,
  useMembersControllerUpdateRole,
  getMembersControllerFindAllQueryKey,
} from '../../api';
import type { Member } from '../../types/trip';
import { useCurrentUserId } from '../../hooks/useCurrentUserId';
import InviteMemberDialog from './InviteMemberDialog';

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface MemberMenuProps {
  member: Member;
  onUpdateRole: (role: 'owner' | 'viewer') => void;
  onRemove: () => void;
}

function MemberMenu({ member, onUpdateRole, onRemove }: MemberMenuProps) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        <MenuItem
          onClick={() => {
            onUpdateRole(member.role === 'viewer' ? 'owner' : 'viewer');
            setAnchor(null);
          }}
        >
          {member.role === 'viewer' ? 'Make owner' : 'Make viewer'}
        </MenuItem>
        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            onRemove();
            setAnchor(null);
          }}
        >
          Remove
        </MenuItem>
      </Menu>
    </>
  );
}

export default function MembersList({ tripId }: { tripId: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const currentUserId = useCurrentUserId();

  const queryKey = getMembersControllerFindAllQueryKey(tripId);
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const { data, isLoading, isError } = useMembersControllerFindAll(tripId);
  const members = (data as unknown as Member[]) ?? [];

  const isOwner = members.some((m) => m.userId === currentUserId && m.role === 'owner');

  const { mutate: updateRole } = useMembersControllerUpdateRole();
  const { mutate: remove } = useMembersControllerRemove();
  const { mutate: leave } = useMembersControllerLeave();

  const handleUpdateRole = (memberId: string, role: 'owner' | 'viewer') => {
    queryClient.setQueryData<Member[]>(queryKey, (old) =>
      old?.map((m) => (m.id === memberId ? { ...m, role } : m)),
    );
    updateRole({ tripId, memberId, data: { role } }, { onSettled: invalidate });
  };

  const handleRemove = (memberId: string) =>
    remove({ tripId, memberId }, { onSuccess: invalidate });

  const handleLeave = () => leave({ tripId }, { onSuccess: invalidate });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Members
        </Typography>
        {isOwner && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Invite
          </Button>
        )}
      </Box>

      {isError && <Alert severity="error">Failed to load members</Alert>}

      {isLoading ? (
        <Stack spacing={1}>
          {[1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </Stack>
      ) : members.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <GroupIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography variant="body2">No members</Typography>
        </Box>
      ) : (
        <List disablePadding>
          {members.map((member, index) => {
            const isMe = member.userId === currentUserId;
            return (
              <ListItem
                key={member.id}
                disablePadding
                sx={{
                  py: 1,
                  px: 0,
                  borderBottom: index < members.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}
                secondaryAction={
                  isMe && !isOwner ? (
                    <Button size="small" color="error" variant="outlined" onClick={handleLeave}>
                      Leave
                    </Button>
                  ) : (
                    <MemberMenu
                      member={member}
                      onUpdateRole={(role) => handleUpdateRole(member.id, role)}
                      onRemove={() => handleRemove(member.id)}
                    />
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>
                    {initials(member.user.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{member.user.name}</span>
                      {isMe && (
                        <Typography variant="caption" color="text.secondary">
                          (you)
                        </Typography>
                      )}
                      <Chip
                        label={member.role}
                        size="small"
                        color={member.role === 'owner' ? 'primary' : 'default'}
                        variant="outlined"
                        sx={{ height: 20, fontSize: 11 }}
                      />
                    </Box>
                  }
                  secondary={member.user.email}
                  slotProps={{ primary: { fontWeight: 500 } }}
                />
              </ListItem>
            );
          })}
        </List>
      )}

      <InviteMemberDialog tripId={tripId} open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
