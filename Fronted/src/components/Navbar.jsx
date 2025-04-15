import { Link } from "react-router-dom";
import { UseAuthStore } from "../store/UseAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

// ✅ Recommended: use state selectors for better reactivity
export const Navbar = () => {
  const authUser = UseAuthStore((state) => state.authUser);
  const logout = UseAuthStore((state) => state.logout);
  

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Home Link */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Howdy</h1>
            </Link>
          </div>

          {/* Right Side - Buttons */}
          <div className="flex items-center gap-2">
            <Link to={"/settings"} className="btn btn-sm gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            { !authUser && (
              <Link to={"/login"} className="btn btn-sm gap-2">
                <MessageSquare className="size-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            { !authUser && (
              <Link to={"/signup"} className="btn btn-sm gap-2">
                <MessageSquare className="size-5" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            )

            }

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  type="button"
                  className="btn btn-sm gap-2"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
