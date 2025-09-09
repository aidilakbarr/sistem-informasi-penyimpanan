type ChatHeaderProps = {
  adminId: string;
  onlineUserIds: string[];
};

const ChatHeader = ({ adminId, onlineUserIds }: ChatHeaderProps) => {
  const isAdminOnline = onlineUserIds.includes(adminId);

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <span
          className={`w-3 h-3 rounded-full ${
            isAdminOnline ? "bg-green-500" : "bg-gray-400"
          }`}
          title={isAdminOnline ? "Online" : "Offline"}
        ></span>
        <h2 className="text-lg font-semibold">
          Admin ({isAdminOnline ? "Online" : "Offline"})
        </h2>
      </div>
    </div>
  );
};

export default ChatHeader;
