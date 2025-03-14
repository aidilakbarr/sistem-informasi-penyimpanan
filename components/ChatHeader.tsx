const ChatHeader = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <span className="bg-green-500 w-3 h-3 rounded-full"></span>
        <h2 className="text-lg font-semibold">Admin (Online)</h2>
      </div>
    </div>
  );
};

export default ChatHeader;
