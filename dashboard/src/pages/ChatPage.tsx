import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, MessageSquare, Users, Hash, Reply, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('getRooms', user?.id);
    });

    newSocket.on('rooms', (data) => {
      setRooms(data);
      if (data.length > 0 && !activeRoom) {
        setActiveRoom(data[0]);
        newSocket.emit('joinRoom', data[0].id);
      }
    });

    newSocket.on('previousMessages', (data) => {
      setMessages(data);
    });

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchUsers();

    return () => {
      newSocket.close();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const response = await userService.findAll();
      setAllUsers(response.data.filter((u: any) => u.id !== user?.id));
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoomChange = (room: any) => {
    setActiveRoom(room);
    socket?.emit('joinRoom', room.id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    socket?.emit('sendMessage', {
      roomId: activeRoom.id,
      content: newMessage,
      userId: user?.id,
      parentId: replyTo?.id,
    });

    setNewMessage('');
    setReplyTo(null);
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'company': return <Users size={18} />;
      case 'department': return <Hash size={18} />;
      default: return <User size={18} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-600" />
            Channels
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomChange(room)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${
                activeRoom?.id === room.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {getRoomIcon(room.type)}
              <span className="truncate">{room.name || room.participants.find((p: any) => p.id !== user?.id)?.username}</span>
            </button>
          ))}
          <div className="pt-4 px-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Direct Messages</h3>
            {allUsers.map((u) => (
              <button
                key={u.id}
                className="w-full flex items-center gap-2 p-2 rounded-lg text-sm text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="truncate">{u.username}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeRoom ? (
          <>
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {getRoomIcon(activeRoom.type)}
                {activeRoom.name || activeRoom.participants.find((p: any) => p.id !== user?.id)?.username}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender.id === user?.id ? 'items-end' : 'items-start'}`}>
                  {msg.parent && (
                    <div className="text-xs text-slate-400 mb-1 flex items-center gap-1 bg-slate-50 p-1 rounded italic">
                      <Reply size={12} />
                      Replying to: {msg.parent.content.substring(0, 30)}...
                    </div>
                  )}
                  <div className={`max-w-[70%] p-3 rounded-2xl ${
                    msg.sender.id === user?.id
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <span className="text-xs font-bold opacity-75">
                        {msg.sender.username} • {msg.sender.employee?.position?.name || 'Employee'}
                      </span>
                      <span className="text-[10px] opacity-50">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <button
                    onClick={() => setReplyTo(msg)}
                    className="text-[10px] text-slate-400 mt-1 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Reply size={10} /> Reply
                  </button>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              {replyTo && (
                <div className="mb-2 p-2 bg-slate-50 rounded-lg flex justify-between items-center text-xs text-slate-600 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Reply size={14} className="text-slate-400" />
                    <span>Replying to <strong>{replyTo.sender.username}</strong></span>
                  </div>
                  <button onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-red-500">
                    ✕
                  </button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <MessageSquare size={64} className="opacity-20" />
            <p>Select a channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
