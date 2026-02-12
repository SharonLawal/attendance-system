import { ShieldCheck, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020617] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-yellow-400" size={28} />
              <h4 className="text-xl font-bold text-white">VeriPoint</h4>
            </div>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              An innovative geolocation-based attendance management system for
              educational institutions.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold mb-4">Product</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  className="hover:text-yellow-400 transition-colors"
                  href="#features"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="hover:text-yellow-400 transition-colors"
                  href="#how-it-works"
                >
                  How it Works
                </a>
              </li>
              <li>
                <a className="hover:text-yellow-400 transition-colors" href="#">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-4">Project</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a className="hover:text-yellow-400 transition-colors" href="#">
                  About
                </a>
              </li>
              <li>
                <a className="hover:text-yellow-400 transition-colors" href="#">
                  GitHub
                </a>
              </li>
              <li>
                <a className="hover:text-yellow-400 transition-colors" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} VeriPoint
          </p>
          <div className="flex gap-4">
            <a
              className="text-slate-500 hover:text-white transition-colors"
              href="#"
            >
              <span className="sr-only">GitHub</span>
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
