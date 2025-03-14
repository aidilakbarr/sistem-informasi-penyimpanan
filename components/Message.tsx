const Message = ({
  text,
  image,
  isUser,
}: {
  text?: string;
  image?: string;
  isUser: boolean;
}) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`p-3 rounded-lg max-w-xs ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {text && <p>{text}</p>}
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
