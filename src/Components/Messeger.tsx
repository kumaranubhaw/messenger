import { Send, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  sender: 'User1' | 'User2';
  text: string;
  timestamp: number;
}

type UserType = 'User1' | 'User2';

const Messenger: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType>('User1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesBoxEndRef = useRef<HTMLDivElement>(null);

  const otherUser: UserType = currentUser === 'User1' ? 'User2' : 'User1';

  // called when user enters text message
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewMessage(e.target.value);
  };

  // Called when user either clicks on send button or press enter key
  const sendMessage = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const currentTime = new Date().getTime();
    const message: Message = {
      id: currentTime,
      sender: currentUser,
      text: newMessage.trim(),
      timestamp: currentTime
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // when user press enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      sendMessage(e);
    }
  };

  // displays the time of message sent
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Switch user from one to another
  const switchUser = (): void => {
    setCurrentUser(currentUser === 'User1' ? 'User2' : 'User1');
  };

  // function to scroll to bottom when message is sent/chat window is loaded
  const scrollToBottom = (): void => {
    messagesBoxEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden h-screen flex flex-col mt-3">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={18} />
          </div>
          <div>
            <h2 className="font-semibold">{otherUser}</h2>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
        <button
          onClick={switchUser}
          className="bg-blue-500 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
        >
          Switch to {otherUser}
        </button>
      </div>

      <div className="bg-gray-100 px-4 py-2 text-sm text-gray-600 border-b">
        You are chatting as: <span className="font-semibold text-blue-600">{currentUser}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === currentUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === currentUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesBoxEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Type a message as ${currentUser}...`}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

}

export default Messenger;