const Message = ({
  text,
  image,
  isUser,
  time,
}: {
  text?: string;
  image?: string;
  isUser: boolean;
  time: any;
}) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`p-3 rounded-lg max-w-xs ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {text && (
          <>
            <div className="text-sm">{text}</div>
            <div className="text-xs text-right opacity-70 mt-1">
              {new Date(time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </>
        )}
        {image && (
          <img
            src={image}
            alt="User upload"
            className="mt-2 rounded-lg max-w-full"
          />
        )}
      </div>
    </div>
  );
};

export default Message;
