import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { user } from './store/items/user';
import { useNavigate } from 'react-router-dom';

interface Message {
    id: string;
    msg: string;
    sender: 'user' | 'bot';
    timestamp: string;
}

interface Session {
    id: string;
    title: string;
    createdAt: string;
    sessionId: string;
}

const useWebSocket = (token: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        if (!token) return;

        const ws = new WebSocket(`wss://jubilant-laughter-bce5d7d8aa.strapiapp.com/?token=${token}`);

        ws.onopen = () => console.log("WebSocket connected");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // console.log("Sessio data: ", data);
            
            if (data.sessionId) {
                // setSession(data);
            } else {
                // setMessages(prev => [...prev, data]);
            }
        };

        ws.onclose = () => console.log("WebSocket disconnected");

        setSocket(ws);
        return () => ws.close();
    }, [token]);

    const sendMessage = (message: string) => {
        console.log("sending message: ", message);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ 
                text: message, 
                sender: 'user',
            }));
        }
    };

    return { socket, messages, sendMessage, session };
};



function MessagePage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [sessions, setSessions] = useState<Session[]>([]);

    const userData = useRecoilValue(user);
    const setUserData = useSetRecoilState(user);
    const navigate = useNavigate();

    const token = localStorage.getItem("token") || "";
    const { socket, sendMessage, session } = useWebSocket(token);

    console.log(session, socket);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadSessions = async () => {
        const response = await fetch("https://jubilant-laughter-bce5d7d8aa.strapiapp.com/api/users/me?populate=chat_sessions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });

        const data = await response.json();
        console.log("Sessions Data: ", data);
        if (response.ok) {
            
            //find only unqiue sessions with uinique sessionId
            const uniqueSessions = data.chat_sessions.filter((session: { sessionId: any; }, index: any) => {
                return data.chat_sessions.findIndex((s: { sessionId: any; }) => s.sessionId === session.sessionId) === index;
            });
            console.log(uniqueSessions);
            setSessions(uniqueSessions);
        } else {
            throw new Error(data.error.message);
        }
    };
    
    useEffect(() => {
        loadSessions();
    }, [sessions]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            msg: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };



        setMessages(prev => [...prev, userMessage]);
        sendMessage(inputMessage);
        setInputMessage('');

        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                msg: `I received your message: "${inputMessage}"`,
                sender: 'bot',
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        console.log("logout")
        setUserData({
            user: {
                id: '',
                username: '',
                email: '',
                avatar: '',
            },
            isLoding: true,
        });
        localStorage.removeItem("token");
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static w-[280px] bg-white border-r border-gray-200 h-full
        transform transition-transform duration-300 ease-in-out z-30
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {userData.isLoding ? (
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                        <div className="max-w-md w-full space-y-4">
                            <button className="w-full p-3 rounded-lg hover:bg-zinc-800 transition-colors duration-200 flex items-center space-x-3 bg-black text-white"
                                onClick={() => {
                                    navigate('/login');
                                }}
                            >
                                Login
                            </button>
                            <button className="w-full p-3 rounded-lg hover:bg-zinc-800 transition-colors duration-200 flex items-center space-x-3 bg-black text-white"
                                onClick={() => {
                                    navigate('/register');
                                }}
                            >
                                Register   
                            </button>

                        </div>
                    </div>
                ) : (
                    <div>

                        <div className="p-4 border-b">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">{userData.user.username}</h2>
                                    <p className="text-sm text-gray-500">Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-4">
                            <div className="space-y-2">
                                <button className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700">New Chat</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-4 border-t">
                        {sessions.map((session) => (
                                <button className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3"
                                    onClick={() => {
                                      
                                        const response = fetch(`https://jubilant-laughter-bce5d7d8aa.strapiapp.com/api/chat-sessions?populate=chat_messages`, {
                                            method: "GET",
                                            headers: {
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                                            },
                                        });

                                        response.then(async (res) => {
                                            const data = await res.json();
                                            console.log(data.data);
                                            let messageArray: any = [];
                                            data.data.map((message: any) => {
                                                console.log("nessage: ", message, "session: ", session);
                                                if(message.sessionId === session.sessionId) {
                                                    messageArray.push(message);
                                                }
                                            });
                                            console.log("Message ",messageArray[0].chat_messages);
                                            // sort by timestamp
                                            const new_array = messageArray[0].chat_messages.sort((a: any, b: any) => a.createdAt - b.createdAt);
                                            console.log(new_array);
                                            setMessages(new_array);

                                            if (res.ok) {
                                                // setMessages(prev => [...prev, data]);
                                            } else {
                                                throw new Error(data.error.message);
                                            }
                                        });
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700">{session.title}</span>
                                </button>
                        ))}
                        </div>
                        <div className="p-4 border-t">
                            <button className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3">
                                <Settings className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-700">Settings</span>
                            </button>
                            <button onClick={handleLogout} className="w-full p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-3 mt-2">
                                <LogOut  className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-700">Logout</span>
                            </button>
                        </div>
                    </div>
                )
                }
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col w-full">
                {/* Chat Header */}
                <div className="h-16 border-b bg-white flex items-center px-4 lg:px-6">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden mr-4 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? (
                            <X className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">AI Assistant</h2>
                            <p className="text-xs text-gray-500">Always here to help</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 scrollbar-hide">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} message-animation`}
                        >
                            <div className={`flex items-end space-x-2 max-w-[85%] lg:max-w-[70%]`}>
                                {message.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-blue-600" />
                                    </div>
                                )}
                                <div
                                    className={`p-3 lg:p-4 rounded-2xl ${message.sender === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 rounded-bl-none'
                                        }`}
                                >
                                    <p className="text-sm lg:text-base">{message.msg}</p>
                                    <p className="text-[10px] lg:text-xs mt-1 opacity-70">
                                        {message.timestamp}
                                    </p>
                                </div>
                                {message.sender === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                    <div className="max-w-screen-xl mx-auto flex items-center space-x-4">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                        />
                        <button
                            type="submit"
                            className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MessagePage;