import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStroe';

const FriendRequestList = () => {
  const { user } = useAuthStore();
  const { friendRequests, fetchFriendRequests } = useChatStore();

  useEffect(() => {
    if (user) fetchFriendRequests();
  }, [user, fetchFriendRequests]);

  if (!friendRequests?.received?.length && !friendRequests?.sent?.length) {
    return <div className="p-4 text-center text-muted-foreground">Không có yêu cầu kết bạn nào</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-2 overflow-y-auto">
      {friendRequests?.received?.length > 0 && (
        <div>
          <div className="font-semibold mb-2">Yêu cầu nhận</div>
          {friendRequests.received.map((req: any) => (
            <div key={req._id} className="p-2 border rounded flex flex-col gap-1">
              <span><b>{req.from.displayName}</b> (@{req.from.username})</span>
              <span className="text-xs text-gray-500">{req.message}</span>
              {/* Accept/Decline buttons here */}
            </div>
          ))}
        </div>
      )}
      {friendRequests?.sent?.length > 0 && (
        <div>
          <div className="font-semibold mb-2 mt-4">Yêu cầu đã gửi</div>
          {friendRequests.sent.map((req: any) => (
            <div key={req._id} className="p-2 border rounded flex flex-col gap-1">
              <span><b>{req.to.displayName}</b> (@{req.to.username})</span>
              <span className="text-xs text-gray-500">{req.message}</span>
              <span className="text-xs text-yellow-600">Trạng thái: {req.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequestList;

