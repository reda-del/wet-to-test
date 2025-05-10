
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! How can I help you today with Ozar Network Labs?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simple rule-based responses
    setTimeout(() => {
      let botResponse = "";
      const lowerCaseMessage = message.toLowerCase();

  if (
    lowerCaseMessage.includes("pricing") || 
    lowerCaseMessage.includes("cost") || 
    lowerCaseMessage.includes("price") || 
    lowerCaseMessage.includes("subscription") || 
    lowerCaseMessage.includes("plan")
  ) {
    botResponse = "Our pricing starts at $19.99 per month. Visit our pricing page for all plans and details.";
  } 
  else if (
    lowerCaseMessage.includes("lab") || 
    lowerCaseMessage.includes("environment") || 
    lowerCaseMessage.includes("virtual") || 
    lowerCaseMessage.includes("practice")
  ) {
    botResponse = "Our virtual labs are available 24/7 and provide realistic, hands-on networking practice.";
  }
  else if (
    lowerCaseMessage.includes("support") || 
    lowerCaseMessage.includes("help") || 
    lowerCaseMessage.includes("contact") || 
    lowerCaseMessage.includes("assistance")
  ) {
    botResponse = "Support is available Monday to Friday, 9AM–6PM ET. Premium users enjoy 24/7 support.";
  }
  else if (
    lowerCaseMessage.includes("certificate") || 
    lowerCaseMessage.includes("certification") || 
    lowerCaseMessage.includes("ccna") || 
    lowerCaseMessage.includes("ccnp") || 
    lowerCaseMessage.includes("exam")
  ) {
    botResponse = "Yes, our labs are tailored to help you prepare for certifications like CCNA, CCNP, and more.";
  }
  else if (
    lowerCaseMessage.includes("account") || 
    lowerCaseMessage.includes("login") || 
    lowerCaseMessage.includes("sign in") || 
    lowerCaseMessage.includes("reset password")
  ) {
    botResponse = "You can log in from the top-right corner. Trouble logging in? Try the 'Forgot Password' link.";
  }
  else if (
    lowerCaseMessage.includes("trial") || 
    lowerCaseMessage.includes("free") || 
    lowerCaseMessage.includes("demo") || 
    lowerCaseMessage.includes("sample")
  ) {
    botResponse = "We offer a free trial with limited access. Just sign up to start exploring!";
  }
  else if (
    lowerCaseMessage.includes("cancel") || 
    lowerCaseMessage.includes("unsubscribe") || 
    lowerCaseMessage.includes("stop")
  ) {
    botResponse = "You can cancel anytime from your account settings. Let us know if you need help with that.";
  }
  else if (
    lowerCaseMessage.includes("team") || 
    lowerCaseMessage.includes("group") || 
    lowerCaseMessage.includes("students") || 
    lowerCaseMessage.includes("organization")
  ) {
    botResponse = "We offer special pricing for teams, students, and organizations. Contact us for a custom offer.";
  }
  else if (
    lowerCaseMessage.includes("bug") || 
    lowerCaseMessage.includes("error") || 
    lowerCaseMessage.includes("issue") || 
    lowerCaseMessage.includes("problem") || 
    lowerCaseMessage.includes("fail")
  ) {
    botResponse = "Sorry for the trouble. Please describe the issue in detail and we'll look into it right away.";
  }
  else if (
    lowerCaseMessage.includes("mobile") || 
    lowerCaseMessage.includes("phone") || 
    lowerCaseMessage.includes("tablet") || 
    lowerCaseMessage.includes("ios") || 
    lowerCaseMessage.includes("android")
  ) {
    botResponse = "Yes, our platform is fully accessible on mobile devices including iOS and Android.";
  }
  else if (
    lowerCaseMessage.includes("language") || 
    lowerCaseMessage.includes("arabic") || 
    lowerCaseMessage.includes("translation")
  ) {
    botResponse = "Our platform currently supports English. Arabic interface is in progress — stay tuned!";
  }
  else if (
    lowerCaseMessage.includes("update") || 
    lowerCaseMessage.includes("new feature") || 
    lowerCaseMessage.includes("roadmap")
  ) {
    botResponse = "We’re constantly improving! Check our blog or roadmap page for upcoming features and updates.";
  }
  else if (
    lowerCaseMessage.includes("browser") || 
    lowerCaseMessage.includes("chrome") || 
    lowerCaseMessage.includes("firefox") || 
    lowerCaseMessage.includes("compatibility")
  ) {
    botResponse = "Our labs work best in Chrome or Firefox. Make sure your browser is up to date.";
  }
  else if (
  lowerCaseMessage.includes("dashboard") ||
  lowerCaseMessage.includes("control panel") ||
  lowerCaseMessage.includes("home screen")
) {
  botResponse = "You can access your dashboard from the main menu after logging in. It shows your active labs and progress.";
}
else if (
  lowerCaseMessage.includes("payment") ||
  lowerCaseMessage.includes("billing") ||
  lowerCaseMessage.includes("invoice") ||
  lowerCaseMessage.includes("charged")
) {
  botResponse = "All payment and billing details can be found in your account under the 'Billing' tab.";
}
else if (
  lowerCaseMessage.includes("student") ||
  lowerCaseMessage.includes("education") ||
  lowerCaseMessage.includes("school") ||
  lowerCaseMessage.includes("university")
) {
  botResponse = "We offer discounts and special access for students. Reach out to us with a valid student email.";
}
else if (
  lowerCaseMessage.includes("teacher") ||
  lowerCaseMessage.includes("instructor") ||
  lowerCaseMessage.includes("trainer")
) {
  botResponse = "Instructors can create class-based labs and monitor student progress. Contact us to set it up.";
}
else if (
  lowerCaseMessage.includes("delete account") ||
  lowerCaseMessage.includes("remove account") ||
  lowerCaseMessage.includes("close my account")
) {
  botResponse = "We're sorry to see you go! You can delete your account from your profile settings.";
}
else if (
  lowerCaseMessage.includes("language") ||
  lowerCaseMessage.includes("translate") ||
  lowerCaseMessage.includes("interface language")
) {
  botResponse = "Currently, our main interface is in English. We're working on adding more languages soon!";
}
else if (
  lowerCaseMessage.includes("api") ||
  lowerCaseMessage.includes("integration") ||
  lowerCaseMessage.includes("webhook")
) {
  botResponse = "Our API and webhook documentation is available to advanced users. Contact us for access.";
}
else if (
  lowerCaseMessage.includes("linux") ||
  lowerCaseMessage.includes("windows") ||
  lowerCaseMessage.includes("mac")
) {
  botResponse = "Our labs run in the cloud and can be accessed from any OS with a modern browser.";
}
else if (
  lowerCaseMessage.includes("data") ||
  lowerCaseMessage.includes("privacy") ||
  lowerCaseMessage.includes("security")
) {
  botResponse = "We take data privacy seriously and follow strict security standards. Check our privacy policy for more.";
}
else if (
  lowerCaseMessage.includes("referral") ||
  lowerCaseMessage.includes("affiliate") ||
  lowerCaseMessage.includes("invite")
) {
  botResponse = "We offer a referral program! Share your link and earn credits when friends sign up.";
}
else if (
  lowerCaseMessage.includes("feedback") ||
  lowerCaseMessage.includes("suggestion") ||
  lowerCaseMessage.includes("idea")
) {
  botResponse = "We love feedback! Let us know what you'd like to see next on the platform.";
}
else if (
  lowerCaseMessage.includes("time limit") ||
  lowerCaseMessage.includes("session expired") ||
  lowerCaseMessage.includes("timeout")
) {
  botResponse = "Lab sessions may time out after inactivity. You can restart them anytime from your dashboard.";
}
else if (
  lowerCaseMessage.includes("save") ||
  lowerCaseMessage.includes("progress") ||
  lowerCaseMessage.includes("history")
) {
  botResponse = "Your progress is saved automatically. You can resume your labs anytime from where you left off.";
}
else if (
  lowerCaseMessage.includes("vpn") ||
  lowerCaseMessage.includes("firewall") ||
  lowerCaseMessage.includes("proxy")
) {
  botResponse = "Some labs may require open ports. If you're on a VPN or restricted network, try switching or disabling it.";
}
else if (
  lowerCaseMessage.includes("browser issue") ||
  lowerCaseMessage.includes("display problem") ||
  lowerCaseMessage.includes("loading issue")
) {
  botResponse = "Try clearing your browser cache or switching browsers. If the problem persists, let us know!";
}
else if (
  lowerCaseMessage.includes("multi-user") ||
  lowerCaseMessage.includes("shared account") ||
  lowerCaseMessage.includes("team access")
) {
  botResponse = "Each user should have their own account. Team plans are available for group access.";
}
else if (
  lowerCaseMessage.includes("progress report") ||
  lowerCaseMessage.includes("lab completion") ||
  lowerCaseMessage.includes("score")
) {
  botResponse = "You can view lab completion status and performance stats in your dashboard.";
}
else if (
  lowerCaseMessage.includes("live chat") ||
  lowerCaseMessage.includes("talk to agent") ||
  lowerCaseMessage.includes("human")
) {
  botResponse = "We're here to help! A live agent will join the chat shortly if available.";
}
else if (
  lowerCaseMessage.includes("offline") ||
  lowerCaseMessage.includes("download") ||
  lowerCaseMessage.includes("access without internet")
) {
  botResponse = "Currently, our labs require an internet connection. Offline mode is not yet supported.";
}
else if (
  lowerCaseMessage.includes("newsletter") ||
  lowerCaseMessage.includes("email updates") ||
  lowerCaseMessage.includes("subscribe")
) {
  botResponse = "Join our newsletter to stay updated with new labs, features, and special offers!";
}
  else {
    botResponse = "Thanks for your message! A team member will follow up shortly. Meanwhile, check our FAQ section.";
  }
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <Button
        onClick={toggleChat}
        className="rounded-full h-14 w-14 shadow-lg bg-ozar-red hover:bg-ozar-red/90 text-white"
        aria-label="Live Chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="bg-ozar-red text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Live Chat Support</h3>
            </div>
            <button 
              onClick={toggleChat} 
              className="text-white hover:bg-ozar-red/90 rounded-full p-1"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[300px]">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-ozar-red text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                  <div 
                    className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 mr-2"
            />
            <Button type="submit" variant="default" size="sm" className="bg-ozar-red hover:bg-ozar-red/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
