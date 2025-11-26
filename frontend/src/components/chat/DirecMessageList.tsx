import {useChatStore} from '@/stores/useChatStroe';
import DirecMessageCard from './DirecMessageCard';

const DirecMessageList = () => {
    const {conversations } = useChatStore();

    if(!conversations) return;

    const directConversations = conversations.filter((convo) => convo.type === 'direct');

  return (
  <div className='flex-1 overflow-y-auto p-2 space-y-2'>
    {
        directConversations.map((convo) => (
            <DirecMessageCard
                convo ={convo}
                key={convo._id}
            />
        ))
    }
  </div>
  );
}

export default DirecMessageList