import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Users, Settings, Home, ExternalLink, Linkedin, Globe, Filter, Eye, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Investor {
  id: string;
  name: string;
  email: string | null;
  organization: string | null;
  total_investment: string | null;
  invested_startups: number | null;
  investment_focus: string | null;
  city: string | null;
  country: string | null;
  minimum_investment: string | null;
  maximum_investment: string | null;
  status: 'pending' | 'verified';
  active: boolean;
  created_at: string;
  updated_at: string;
  avatar: string | null;
  linkedin_url: string | null;
  website: string | null;
}

interface FounderProfile {
  name: string;
  email: string;
  company_name?: string;
  industry?: string;
  founded_date?: string;
}

interface InvestorDetailsModalProps {
  investor: Investor;
  isOpen: boolean;
  onClose: () => void;
}

const InvestorDetailsModal = ({ investor, isOpen, onClose }: InvestorDetailsModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center">
            {investor.name}
            {investor.status === 'verified' && (
              <div className="ml-1 bg-green-600 rounded-full p-0.5">
                <BadgeCheck className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={investor.avatar || undefined} />
              <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{investor.name}</h3>
              {investor.organization && (
                <p className="text-gray-600">{investor.organization}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Contact</label>
            <p className="text-gray-900">{investor.email || 'Not available'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Location</label>
            <p className="text-gray-900">
              {investor.city && investor.country 
                ? `${investor.city}, ${investor.country}`
                : 'Not specified'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
              investor.status === 'verified' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {investor.status.charAt(0).toUpperCase() + investor.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Investment Focus</label>
            <p className="text-gray-900">{investor.investment_focus || 'Not specified'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Investment Range</label>
            <p className="text-gray-900">
              {investor.minimum_investment && investor.maximum_investment
                ? `$${investor.minimum_investment} - $${investor.maximum_investment}`
                : 'Not specified'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Total Investment</label>
            <p className="text-gray-900">{investor.total_investment ? `$${investor.total_investment}` : 'Not specified'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Invested Startups</label>
            <p className="text-gray-900">{investor.invested_startups || 0}</p>
          </div>

          <div className="flex space-x-4 pt-4">
            {investor.linkedin_url && (
              <a
                href={investor.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Linkedin className="h-5 w-5 mr-1" />
                LinkedIn
              </a>
            )}
            {investor.website && (
              <a
                href={investor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <Globe className="h-5 w-5 mr-1" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default function FounderDashboard() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('investors');
  const [profile, setProfile] = useState<FounderProfile | null>(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<keyof Investor>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  useEffect(() => {
    checkUserRole();
    fetchFounderProfile();
    if (activeTab === 'investors') {
      fetchInvestors();
    }
  }, [activeTab]);

  const checkUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (!userData || userData.role !== 'founder') {
      navigate('/auth');
    }
  };

  const fetchFounderProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('founders')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setProfile({
          name: data.name || user.email?.split('@')[0] || '',
          email: user.email || '',
          company_name: data.company_name,
          industry: data.industry,
          founded_date: data.founded_date,
        });
      }
    }
  };

  const fetchInvestors = async () => {
    try {
      const { data, error } = await supabase
        .from('investors')
        .select('*');

      if (error) throw error;
      setInvestors(data || []);
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const filteredInvestors = investors
    .filter(investor => 
      (investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       investor.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       investor.investment_focus?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || investor.status === statusFilter)
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue === null) return sortOrder === 'asc' ? 1 : -1;
      if (bValue === null) return sortOrder === 'asc' ? -1 : 1;
      return sortOrder === 'asc' 
        ? aValue < bValue ? -1 : 1
        : aValue > bValue ? -1 : 1;
    });

  const renderInvestorCard = (investor: Investor) => (
    <div key={investor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={investor.avatar || undefined} />
            <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{investor.name}</h3>
              {investor.status === 'verified' && (
                <div className="ml-1 bg-green-600 rounded-full p-0.5">
                  <BadgeCheck className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            {investor.organization && (
              <p className="text-sm text-gray-600">{investor.organization}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {investor.linkedin_url && (
            <a
              href={investor.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {investor.website && (
            <a
              href={investor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800"
            >
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="text-sm font-medium">
            {investor.city && investor.country 
              ? `${investor.city}, ${investor.country}`
              : 'Not specified'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Investment Focus</p>
          <p className="text-sm font-medium">{investor.investment_focus || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Investment Range</p>
          <p className="text-sm font-medium">
            {investor.minimum_investment && investor.maximum_investment
              ? `$${investor.minimum_investment} - $${investor.maximum_investment}`
              : 'Not specified'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Invested Startups</p>
          <p className="text-sm font-medium">{investor.invested_startups || 0}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className={`px-2 py-1 text-xs rounded-full ${
          investor.status === 'verified' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {investor.status.charAt(0).toUpperCase() + investor.status.slice(1)}
        </span>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedInvestor(investor)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            Contact
          </Button>
        </div>
      </div>
    </div>
  );

  const renderInvestorsContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search investors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Status: {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('verified')}>
                Verified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInvestors.map(renderInvestorCard)}
      </div>

      {filteredInvestors.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No investors found matching your criteria.
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Founder Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <div className="mt-1 text-gray-900">{profile?.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 text-gray-900">{profile?.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <div className="mt-1 text-gray-900">{profile?.company_name || '-'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <div className="mt-1 text-gray-900">{profile?.industry || '-'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Founded Date</label>
                <div className="mt-1 text-gray-900">{profile?.founded_date || '-'}</div>
              </div>
            </div>
          </div>
        );

      case 'investors':
        return renderInvestorsContent();

      default:
        return null;
    }
  };

  if (loading && activeTab === 'investors') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <nav className="mt-6">
            <div
              className={`flex items-center px-6 py-3 cursor-pointer ${
                activeTab === 'investors' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('investors')}
            >
              <Users className="w-5 h-5 mr-3" />
              <span>Investors</span>
            </div>
            <div
              className={`flex items-center px-6 py-3 cursor-pointer ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-5 h-5 mr-3" />
              <span>Profile</span>
            </div>
            <div
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer mt-auto"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Add the modal */}
      {selectedInvestor && (
        <InvestorDetailsModal
          investor={selectedInvestor}
          isOpen={!!selectedInvestor}
          onClose={() => setSelectedInvestor(null)}
        />
      )}
    </>
  );
} 