/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  Home, 
  Utensils, 
  BookOpen, 
  User, 
  PlusCircle, 
  Flame, 
  MapPin, 
  Clock, 
  Users, 
  ChefHat,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface Event {
  id: string;
  host: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  ingredients: string[];
  joinedByMe: boolean;
}

interface Recipe {
  id: string;
  title: string;
  author: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
}

type Tab = "dashboard" | "planner" | "cookbook" | "profile";

// --- Mock Data ---
const INITIAL_EVENTS: Event[] = [
  {
    id: "e1",
    host: "Sarah J.",
    title: "Pasta Night in Harbor Hall",
    date: "2026-04-26",
    time: "6:30 PM",
    location: "Harbor Hall Lounge",
    attendees: 4,
    maxAttendees: 6,
    ingredients: ["Penne pasta", "Marinara sauce", "Garlic", "Parmesan"],
    joinedByMe: false
  },
  {
    id: "e2",
    host: "Mike D.",
    title: "Taco Tuesday @ Guild",
    date: "2026-04-27",
    time: "7:00 PM",
    location: "Guild Hall Kitchen",
    attendees: 3,
    maxAttendees: 8,
    ingredients: ["Beef", "Taco shells", "Shredded lettuce", "Salsa"],
    joinedByMe: false
  }
];

const INITIAL_RECIPES: Recipe[] = [
  { id: "r1", title: "Dorm-Room Ramen Upgrade", author: "Alex K.", tags: ["Quick", "Budget"], difficulty: "Easy", time: "10 mins" },
  { id: "r2", title: "Wagner Family Lasagna", author: "Coach Maria", tags: ["Family Style", "Emerald Choice"], difficulty: "Hard", time: "2 hours" },
  { id: "r3", title: "Vegan Buddha Bowl", author: "Sustainability Club", tags: ["Vegan", "Healthy"], difficulty: "Medium", time: "30 mins" },
  { id: "r4", title: "Emerald Pesto Pasta", author: "The Chef", tags: ["Signature", "$10"], difficulty: "Easy", time: "15 mins" }
];

// --- Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`hand-drawn-card p-4 ${className}`}>
    {children}
  </div>
);

const NavItem = ({ active, icon: Icon, label, onClick }: { active: boolean; icon: any; label: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? "text-cream scale-110" : "text-cream/50 hover:text-cream"}`}
  >
    <Icon size={24} />
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("wagner_events");
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });
  const [recipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("wagner_streak");
    return saved ? parseInt(saved) : 4; // Default starting streak for demo
  });
  const [notifications, setNotifications] = useState<string[]>([]);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem("wagner_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("wagner_streak", streak.toString());
  }, [streak]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [...prev, msg]);
    setTimeout(() => setNotifications(prev => prev.slice(1)), 3000);
  };

  const handleJoinEvent = (id: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === id && !e.joinedByMe && e.attendees < e.maxAttendees) {
        addNotification("Joined the event! See you there.");
        return { ...e, attendees: e.attendees + 1, joinedByMe: true };
      }
      return e;
    }));
    setStreak(s => s + 1);
  };

  // --- Renderers ---

  const renderDashboard = () => (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-end px-2">
        <div>
          <p className="text-sm font-bold text-trust uppercase tracking-widest text-emerald">The Kitchen Table</p>
          <h1 className="text-4xl">What's Cooking, Wagner?</h1>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 bg-emerald text-cream px-3 py-1 hand-drawn-border">
            <Flame size={18} fill="currentColor" />
            <span className="font-bold">{streak}-Day Streak</span>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-2xl mb-4 px-2">Daily Special</h2>
        <Card className="flex flex-col md:flex-row gap-6 bg-emerald/5 border-dashed overflow-hidden">
          <div className="w-full md:w-1/3 aspect-video bg-emerald/10 rounded-lg flex items-center justify-center relative border-2 border-emerald/20 border-dashed">
             < ChefHat size={64} className="text-emerald/20" />
             <div className="absolute top-2 left-2 bg-emerald text-cream px-2 py-0.5 text-xs font-bold rounded">STUDENT CHOICE</div>
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-3xl text-emerald">Pecan Sandies & Sage Tea</h3>
            <p className="text-sm italic">"A cozy Wagner classic for studying in the library. Shared by Marcus from the Culinary Club."</p>
            <div className="flex gap-4">
              <span className="text-xs flex items-center gap-1 font-bold"><Clock size={12}/> 30 Mins</span>
              <span className="text-xs flex items-center gap-1 font-bold text-emerald"><TrendingUp size={12}/> Easy</span>
            </div>
            <button 
              onClick={() => {
                setStreak(s => s + 1);
                addNotification("Recipe saved to your cookbook!");
              }}
              className="interactive-button w-full sm:w-auto"
            >
              Get Recipe
            </button>
          </div>
        </Card>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-2xl">Upcoming Meals</h2>
          <button onClick={() => setActiveTab("planner")} className="text-emerald font-bold text-sm flex items-center gap-1 hover:underline">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {events.slice(0, 3).map(event => (
            <div key={event.id}>
              <Card className="relative group">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-2xl text-emerald">{event.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                       <span className="text-xs flex items-center gap-1 font-medium bg-cream/50 px-2 py-1 rounded"><User size={12}/> {event.host}</span>
                       <span className="text-xs flex items-center gap-1 font-medium bg-cream/50 px-2 py-1 rounded"><MapPin size={12}/> {event.location}</span>
                       <span className="text-xs flex items-center gap-1 font-medium bg-cream/50 px-2 py-1 rounded"><Clock size={12}/> {event.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-end justify-center min-w-[120px]">
                    <p className="text-[10px] font-bold text-emerald uppercase tracking-tighter mb-1">
                      {event.maxAttendees - event.attendees} Spots Left
                    </p>
                    <button 
                      disabled={event.joinedByMe}
                      onClick={() => handleJoinEvent(event.id)}
                      className={`${event.joinedByMe ? "bg-rust cursor-not-allowed" : "interactive-button"} w-full sm:w-auto`}
                    >
                      {event.joinedByMe ? "See You There!" : "Join & Chip In"}
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderPlanner = () => (
    <div className="space-y-6 pb-24">
      <header className="px-2">
        <p className="text-sm font-bold text-emerald uppercase tracking-widest">The Prep Station</p>
        <h1 className="text-4xl">Host a Meal</h1>
      </header>

      <Card className="max-w-2xl mx-auto space-y-6">
        <div className="p-4 bg-emerald/5 border-2 border-emerald/10 hand-drawn-border text-center">
            <p className="text-sm italic">"Cooking together builds stronger bonds. What's on your menu?"</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          addNotification("Your event has been posted!");
          setStreak(s => s + 1);
          setActiveTab("dashboard");
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald ml-1">Event Title</label>
              <input type="text" placeholder="e.g. Pancake Breakfast" className="w-full p-3 bg-cream/20 border-2 border-coffee hand-drawn-border focus:bg-white outline-none transition-colors" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald ml-1">Location</label>
              <input type="text" placeholder="e.g. Towers Kitchenette" className="w-full p-3 bg-cream/20 border-2 border-coffee hand-drawn-border focus:bg-white outline-none transition-colors" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald ml-1">Time</label>
              <input type="time" className="w-full p-3 bg-cream/20 border-2 border-coffee hand-drawn-border focus:bg-white outline-none transition-colors" required />
            </div>
            <div className="space-y-1">
               <label className="text-xs font-bold uppercase tracking-widest text-emerald ml-1">Max Guests</label>
               <input type="number" min="1" max="20" placeholder="6" className="w-full p-3 bg-cream/20 border-2 border-coffee hand-drawn-border focus:bg-white outline-none transition-colors" required />
            </div>
            <div className="space-y-1">
               <label className="text-xs font-bold uppercase tracking-widest text-emerald ml-1">Ingredient to Share</label>
               <input type="text" placeholder="e.g. Eggs" className="w-full p-3 bg-cream/20 border-2 border-coffee hand-drawn-border focus:bg-white outline-none transition-colors" required />
            </div>
          </div>

          <div className="pt-4">
             <button type="submit" className="interactive-button w-full text-lg py-4">
                <PlusCircle size={20} />
                Post This Meal
             </button>
          </div>
        </form>
      </Card>
    </div>
  );

  const renderCookbook = () => (
    <div className="space-y-6 pb-24">
      <header className="px-2">
        <p className="text-sm font-bold text-emerald uppercase tracking-widest">The Cookbook</p>
        <h1 className="text-4xl text-center md:text-left">Student-Shared Recipes</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div key={recipe.id}>
            <Card className="cursor-pointer hover:-rotate-1 hover:scale-[1.02] transition-transform duration-300 group">
              <div className="flex justify-between items-start border-b-2 border-emerald/10 pb-2 mb-3">
                <h3 className="text-2xl leading-none group-hover:text-emerald transition-colors">{recipe.title}</h3>
                <div className="p-1 bg-emerald/10 rounded">
                   <Utensils size={14} className="text-emerald" />
                </div>
              </div>
              <p className="text-xs font-bold text-rust mb-4">By: {recipe.author}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                 {recipe.tags.map(tag => (
                   <span key={tag} className="bg-emerald text-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full">{tag}</span>
                 ))}
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-coffee/60">
                <span className="flex items-center gap-1"><Clock size={10} /> {recipe.time}</span>
                <span className="flex items-center gap-1">< TrendingUp size={10} /> {recipe.difficulty}</span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
         <button className="interactive-button">
            <PlusCircle size={20} /> Share Your Recipe
         </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 pb-24">
       <header className="px-2 text-center">
        <div className="w-24 h-24 bg-emerald hand-drawn-border mx-auto mb-4 flex items-center justify-center">
            <User size={48} className="text-cream" />
        </div>
        <h1 className="text-4xl mb-1">Welcome Home, Chef!</h1>
        <p className="text-sm font-bold text-rust uppercase tracking-widest">Master of the dorm kitchen</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center p-8 bg-emerald text-cream border-none">
            <Flame size={48} className="mb-2" />
            <span className="text-5xl font-accent">{streak}</span>
            <span className="text-xs font-bold uppercase tracking-widest mt-1">Day Streak</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-8">
            <Users size={48} className="text-emerald mb-2" />
            <span className="text-5xl font-accent">12</span>
            <span className="text-xs font-bold uppercase tracking-widest mt-1">Friends Fed</span>
        </Card>
        <Card className="flex flex-col items-center justify-center p-8">
            <Award size={48} className="text-rust mb-2" />
            <span className="text-5xl font-accent">3</span>
            <span className="text-xs font-bold uppercase tracking-widest mt-1">Badges Earned</span>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl px-2">Your Recent Activity</h2>
        <Card className="space-y-3">
          <div className="flex items-center gap-3 p-2 bg-emerald/5 border-l-4 border-emerald">
             <span className="text-xs font-bold text-rust">TODAY</span>
             <p className="text-sm font-medium">You joined <span className="font-bold text-emerald">Pasta Night</span> at Harbor Hall.</p>
          </div>
          <div className="flex items-center gap-3 p-2 border-l-4 border-transparent">
             <span className="text-xs font-bold text-coffee/30">YESTERDAY</span>
             <p className="text-sm font-medium text-coffee/60">You shared the "Emerald Pesto" recipe.</p>
          </div>
        </Card>
      </section>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 min-h-screen custom-scrollbar selection:bg-emerald">
      
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map((note, i) => (
            <motion.div
              key={i}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-emerald text-cream px-6 py-3 hand-drawn-border shadow-lg font-bold flex items-center gap-3"
            >
              <ChefHat size={18} />
              {note}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "planner" && renderPlanner()}
            {activeTab === "cookbook" && renderCookbook()}
            {activeTab === "profile" && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-40">
        <div className="bg-emerald p-4 flex justify-between items-center px-8 shadow-2xl hand-drawn-border">
          <NavItem 
            active={activeTab === "dashboard"} 
            icon={Home} 
            label="Home" 
            onClick={() => setActiveTab("dashboard")} 
          />
          <NavItem 
            active={activeTab === "planner"} 
            icon={PlusCircle} 
            label="Host" 
            onClick={() => setActiveTab("planner")} 
          />
          <NavItem 
            active={activeTab === "cookbook"} 
            icon={BookOpen} 
            label="Cookbook" 
            onClick={() => setActiveTab("cookbook")} 
          />
          <NavItem 
            active={activeTab === "profile"} 
            icon={User} 
            label="Chef" 
            onClick={() => setActiveTab("profile")} 
          />
        </div>
      </nav>

      {/* Background Decorative Accent */}
      <div className="fixed -bottom-10 -right-10 opacity-5 pointer-events-none rotate-12">
         <ChefHat size={300} text-emerald />
      </div>
    </div>
  );
}
