import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Search, User, Phone, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { MobileMenu } from "@/components/MobileMenu";

export const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();

  // heights used to offset the fixed navigation when top bar is visible
  const TOP_BAR_HEIGHT = 64; // px — adjust to match your top bar actual height
  const NAV_HEIGHT = 48; // px — adjust to match nav height (h-10/md:h-12)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsScrollingUp(false);
      } else {
        setIsScrollingUp(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Top bar (fixed and slides away on scroll) */}
      <div
        className={`left-0 right-0 z-60 transition-transform duration-300`}
        style={{ transform: isScrollingUp ? "translateY(0)" : `translateY(-${TOP_BAR_HEIGHT}px)` }}
      >
        <div className="bg h-full">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <div className="flex items-center gap-3 md:gap-6">
                <a href="tel:+44123456789" className="flex items-center gap-1 md:gap-2 hover:opacity-80 transition-smooth">
                  <Phone className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">+44 123 456 789</span>
                </a>
                <a href="mailto:sales@cnfoods.com" className="flex items-center gap-1 md:gap-2 hover:opacity-80 transition-smooth">
                  <Mail className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">sales@cnfoods.com</span>
                </a>
              </div>
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="text-xl md:text-2xl font-bold text-primary">CN Foods</div>
              </Link>
              <div className="flex items-center gap-2 md:gap-4">
                <Button variant="ghost" size="icon" className="relative h-8 w-8" asChild>
                  <Link to="/liked">
                    <Heart className="h-4 w-4" />
                    {wishlistTotal > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                        {wishlistTotal}
                      </Badge>
                    )}
                    <span className="sr-only">Favorites</span>
                  </Link>
                </Button>
                <div className="flex items-center gap-1 md:gap-2">
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10" asChild>
                    <Link to="/cart">
                      <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                      {totalItems > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 flex items-center justify-center p-0 text-[10px] md:text-xs">
                          {totalItems}
                        </Badge>
                      )}
                      <span className="sr-only">Cart</span>
                    </Link>
                  </Button>
                </div>
                {user ? (
                  <div className="flex items-center gap-1 md:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/profile")}
                      className="h-8 text-xs md:text-sm px-2 md:px-3"
                    >
                      <User className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                      <span className="hidden md:inline">My Profile</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-primary-foreground hover:bg-primary-foreground/10 h-8 text-xs md:text-sm px-2 md:px-3"
                    >
                      <LogOut className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                      <span className="hidden md:inline">Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="h-8 text-xs md:text-sm px-2 md:px-3"
                  >
                    <User className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden md:inline">Sign In</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation (fixed/sticky, always accessible). When top bar is visible nav sits below it. */}
      <nav
        className="fixed left-0 right-0 z-50 bg-white shadow-md transition-all"
        style={{ top: isScrollingUp ? `${TOP_BAR_HEIGHT}px` : "0" }}
      >
        <div className="container mx-auto px-4">
          <NavigationMenu className="justify-center max-w-full">
            <NavigationMenuList className="flex-wrap justify-center gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button variant="ghost" className="rounded-sm h-10 md:h-12 text-sm whitespace-nowrap" asChild>
                    <Link to="/">Home</Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button variant="ghost" className="rounded-sm h-10 md:h-12 text-sm whitespace-nowrap" asChild>
                    <Link to="/shop">Shop</Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button variant="ghost" className="rounded-sm h-10 md:h-12 text-sm whitespace-nowrap" asChild>
                    <Link to="/fast-order">Fast Order</Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {!user && (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Button variant="ghost" className="rounded-sm h-10 md:h-12 text-sm whitespace-nowrap" asChild>
                        <Link to="/new-customer-signup">New Customer Signup</Link>
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Button variant="ghost" className="rounded-sm h-10 md:h-12 text-sm whitespace-nowrap" asChild>
                        <Link to="/new-supplier-signup">New Supplier Signup</Link>
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="rounded-sm h-10 md:h-12 text-sm whitespace-nowrap">
                  Get in Touch
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[200px]">
                  <ul className="p-2 space-y-1">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/contact-us" className="block px-4 py-2 hover:bg-muted rounded-sm transition-colors">
                          Contact Us
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/customer-services" className="block px-4 py-2 hover:bg-muted rounded-sm transition-colors">
                          Customer Services
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Spacer so page content isn't hidden under fixed top bar + nav */}
      <div style={{ height: `${TOP_BAR_HEIGHT + NAV_HEIGHT}px` }} aria-hidden />
    </>
  );
};
