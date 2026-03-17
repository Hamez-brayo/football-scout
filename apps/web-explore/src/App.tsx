import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Route1 from './routes/Route1';
import Route2 from './routes/Route2';
import Route3 from './routes/Route3';
import Route4 from './routes/Route4';
import Route5 from './routes/Route5';
import Route6 from './routes/Route6';
import Route7 from './routes/Route7';
import Route8 from './routes/Route8';
import Route9 from './routes/Route9';
import Route10 from './routes/Route10';
import Route11 from './routes/Route11';
import Route12 from './routes/Route12';
import Route13 from './routes/Route13';
import Route14 from './routes/Route14';
import Route15 from './routes/Route15';
import Route16 from './routes/Route16';
import Route17 from './routes/Route17';
import Route18 from './routes/Route18';
import Route19 from './routes/Route19';
import Route20 from './routes/Route20';
import Route21 from './routes/Route21';
import Route22 from './routes/Route22';
import Route23 from './routes/Route23';
import Route24 from './routes/Route24';
import Route25 from './routes/Route25';

function Index() {
  const routes = [
    { path: '/1', label: 'Brutalist / Raw', desc: 'Crude efficiency, massive impact' },
    { path: '/2', label: 'Retro-Futuristic', desc: 'Glowing terminals, sci-fi analytical' },
    { path: '/3', label: 'Luxury / Refined', desc: 'Editorial, elite spacing, elegant' },
    { path: '/4', label: 'Playful / Toy-like', desc: 'Chunky, neo-brutalist friendly' },
    { path: '/5', label: 'Maximalist Chaos', desc: 'Anarchy, overlapping textures' },
    { path: '/6', label: 'Tactical Board', desc: 'Whiteboard tactics, chalk lines' },
    { path: '/7', label: 'Matchday Matrix', desc: 'Neon scoreboard, stadium lights' },
    { path: '/8', label: 'Stadium Concrete', desc: 'Monolithic, brutalist concrete terrace' },
    { path: '/9', label: 'Data Heatmap', desc: 'Organic radar charts, data-viz pitch' },
    { path: '/10', label: 'Vintage Program', desc: 'Paper texture, matchday register' },
    { path: '/11', label: 'Blueprint', desc: 'Scouting architectural plans, grids' },
    { path: '/12', label: 'Golden Director', desc: 'Prestige luxury, gold and glass' },
    { path: '/13', label: 'Draft Card', desc: 'Varsity aesthetics, 3D card flip' },
    { path: '/14', label: 'Biometric Scan', desc: 'Kinematic tracking, cyber-athlete' },
    { path: '/15', label: 'Manager\'s Office', desc: 'Wood, leather, absolute authority' },
    { path: '/16', label: 'Training Ground', desc: 'Neon bibs, turf intensity, speed' },
    { path: '/17', label: 'Analyst Room', desc: 'Multi-monitor tracking grid' },
    { path: '/18', label: 'The Tunnel', desc: 'Pre-match tension, concrete shadows' },
    { path: '/19', label: 'VAR Room', desc: 'Technical UI, video review streams' },
    { path: '/20', label: 'Scout Notebook', desc: 'Grungy notes, torn paper, ink' },
    { path: '/21', label: 'Fan Culture', desc: 'Terrace flags, ultras, match tickets' },
    { path: '/22', label: 'Press Room', desc: 'Newspaper print, camera flashes' },
    { path: '/23', label: 'Locker Room', desc: 'Player kit selection, team colors' },
    { path: '/24', label: 'VIP Pass', desc: 'Lanyard access, scan codes' },
    { path: '/25', label: 'Organic Pitch', desc: 'Grass textures, grounded stats' },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8 font-sans">
      <h1 className="text-5xl md:text-6xl font-black mt-8 mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-green-400">Vysion Analytics Hub</h1>
      <p className="text-neutral-400 mb-12 max-w-2xl text-center text-lg leading-relaxed">
        Explore 25 distinct football-infused design directions.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full max-w-[1600px] mb-20">
        {routes.map((route, i) => (
          <Link 
            key={route.path} 
            to={route.path}
            className="group block p-5 border border-neutral-800 rounded-xl bg-neutral-900/40 hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-neutral-500 mb-2">ROUTE {String(i + 1).padStart(2, '0')}</div>
              <div className="text-lg font-bold mb-2 group-hover:text-white text-neutral-200 transition-colors leading-tight">{route.label}</div>
              <div className="text-sm text-neutral-400 mb-6">{route.desc}</div>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#00FFCC] group-hover:text-[#00FFCC] opacity-50 group-hover:opacity-100 flex items-center transition-all">
              Initialize Prototype 
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/1" element={<Route1 />} />
        <Route path="/2" element={<Route2 />} />
        <Route path="/3" element={<Route3 />} />
        <Route path="/4" element={<Route4 />} />
        <Route path="/5" element={<Route5 />} />
        <Route path="/6" element={<Route6 />} />
        <Route path="/7" element={<Route7 />} />
        <Route path="/8" element={<Route8 />} />
        <Route path="/9" element={<Route9 />} />
        <Route path="/10" element={<Route10 />} />
        <Route path="/11" element={<Route11 />} />
        <Route path="/12" element={<Route12 />} />
        <Route path="/13" element={<Route13 />} />
        <Route path="/14" element={<Route14 />} />
        <Route path="/15" element={<Route15 />} />
        <Route path="/16" element={<Route16 />} />
        <Route path="/17" element={<Route17 />} />
        <Route path="/18" element={<Route18 />} />
        <Route path="/19" element={<Route19 />} />
        <Route path="/20" element={<Route20 />} />
        <Route path="/21" element={<Route21 />} />
        <Route path="/22" element={<Route22 />} />
        <Route path="/23" element={<Route23 />} />
        <Route path="/24" element={<Route24 />} />
        <Route path="/25" element={<Route25 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
