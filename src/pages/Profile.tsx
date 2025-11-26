import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Package, MapPin, CreditCard, LogOut } from "lucide-react";

interface Profile {
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
}

interface UserRole {
  role: string;
}

interface Address {
  id: string;
  address_type: string;
  street_address: string;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    await loadProfile(user.id);
  };

  const loadProfile = async (userId: string) => {
    try {
      // TODO: Uncomment when database tables are created
      // Load profile
      // const { data: profileData, error: profileError } = await supabase
      //   .from("profiles")
      //   .select("*")
      //   .eq("user_id", userId)
      //   .single();

      // if (profileError) throw profileError;
      // setProfile(profileData);

      // Load roles
      // const { data: rolesData, error: rolesError } = await supabase
      //   .from("user_roles")
      //   .select("role")
      //   .eq("user_id", userId);

      // if (rolesError) throw rolesError;
      // setRoles(rolesData || []);

      // Load addresses
      // const { data: addressesData, error: addressesError } = await supabase
      //   .from("addresses")
      //   .select("*")
      //   .eq("user_id", userId)
      //   .order("is_default", { ascending: false });

      // if (addressesError) throw addressesError;
      // setAddresses(addressesData || []);

      // Load orders
      // const { data: ordersData, error: ordersError } = await supabase
      //   .from("orders")
      //   .select("*")
      //   .eq("user_id", userId)
      //   .order("created_at", { ascending: false })
      //   .limit(10);

      // if (ordersError) throw ordersError;
      // setOrders(ordersData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // TODO: Uncomment when profiles table is created
      // const { error } = await supabase
      //   .from("profiles")
      //   .update({
      //     full_name: profile.full_name,
      //     phone: profile.phone,
      //     company_name: profile.company_name,
      //   })
      //   .eq("user_id", user.id);

      // if (error) throw error;

      toast({
        title: "Profile updated (mock)",
        description: "Database tables not yet created. Changes not saved.",
      });
      setEditMode(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">My Profile</h1>
              <p className="text-sm md:text-base text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full sm:w-auto">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="details" className="space-y-4 md:space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="details" className="text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-2.5">
                <User className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-2.5">
                <Package className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-2.5">
                <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 md:py-2.5">
                <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>View and edit your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    {roles.map((role, index) => (
                      <Badge key={index} variant="secondary">
                        {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
                      </Badge>
                    ))}
                  </div>

                  <Separator />

                  {profile && (
                    <form onSubmit={updateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          disabled={!editMode}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={profile.email}
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone || ""}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!editMode}
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={profile.company_name || ""}
                          onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                          disabled={!editMode}
                          placeholder="Enter company name"
                        />
                      </div>

                      <div className="flex gap-2">
                        {!editMode ? (
                          <Button type="button" onClick={() => setEditMode(true)}>
                            Edit Profile
                          </Button>
                        ) : (
                          <>
                            <Button type="submit">Save Changes</Button>
                            <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View your past orders and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm md:text-base text-muted-foreground">No orders yet</p>
                      <Button className="mt-4" size="sm" onClick={() => navigate("/shop")}>
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-3 md:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                              <p className="text-sm md:text-base font-semibold">Order #{order.order_number}</p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className="w-fit">
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-base md:text-lg font-semibold">£{order.total_amount.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Addresses</CardTitle>
                  <CardDescription>Manage your shipping and billing addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm md:text-base text-muted-foreground">No addresses saved</p>
                      <Button className="mt-4" size="sm" variant="outline">
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {addresses.map((address) => (
                        <div key={address.id} className="border rounded-lg p-3 md:p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant={address.is_default ? "default" : "secondary"} className="text-xs">
                              {address.is_default ? "Default" : address.address_type}
                            </Badge>
                          </div>
                          <p className="text-sm md:text-base font-medium">{address.street_address}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {address.city}, {address.state && `${address.state}, `}{address.postal_code}
                          </p>
                          <p className="text-xs md:text-sm text-muted-foreground">{address.country}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your payment methods and billing details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CreditCard className="h-10 w-10 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm md:text-base text-muted-foreground">No payment methods saved</p>
                    <Button className="mt-4" size="sm" variant="outline">
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
