import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div role="navigation" className="fixed top-3 left-1/2 -translate-x-1/2 z-[1000]">
      <div className="flex items-center gap-1 md:gap-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-1.5 py-1.5 md:px-3 md:py-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        <NavLink
          to="/"
          className={({ isActive }) => `group inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base transition ${isActive ? 'bg-white text-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
        >
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) => `group inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base transition ${isActive ? 'bg-white text-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
        >
          <span className="inline-block size-1.5 md:size-2 rounded-full bg-[#E60C2C] group-hover:scale-110 transition" />
          <span>Events</span>
        </NavLink>

        <NavLink
          to="/team"
          className={({ isActive }) => `group inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base transition ${isActive ? 'bg-white text-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
        >
          <span className="inline-block size-1.5 md:size-2 rounded-full bg-[#0066B1] group-hover:scale-110 transition" />
          <span>Team</span>
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) => `group inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base transition ${isActive ? 'bg-white text-black' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
        >
          <span className="inline-block size-1.5 md:size-2 rounded-full bg-[#00AEEF] group-hover:scale-110 transition" />
          <span>Contact</span>
        </NavLink>

        <NavLink
          to="/join"
          className={({ isActive }) => `group inline-flex items-center gap-1.5 md:gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-base font-semibold transition ${
            isActive
              ? 'bg-gradient-to-r from-[#0066B1] via-[#00AEEF] to-[#E60C2C] text-white shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          }`}
        >
          <span className="inline-block size-1.5 md:size-2 rounded-full bg-[#34A853] animate-pulse" />
          <span>Join Us</span>
        </NavLink>
      </div>
    </div>
  )
}

export default NavBar