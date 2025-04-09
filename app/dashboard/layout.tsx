'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Package, 
  Book, 
  ShoppingCart, 
  Bell, 
  User,
  Loader2,
  LogOut
} from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive?: boolean;
}

interface UserData {
  email: string;
  isAdmin: boolean;
  fullName?: string;
}

function SidebarLink({ href, icon: Icon, children, isActive }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-white text-blue-600 font-medium shadow-md transform scale-105' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
      <span>{children}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({
            email: user.email || '',
            isAdmin: userDoc.data().isAdmin || false,
            fullName: userDoc.data().fullName || user.displayName || undefined
          });
        }
      } else {
        setUserData(null);
        router.push('/auth/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">Safisaana Store</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <SidebarLink 
              href="/dashboard" 
              icon={LayoutDashboard}
              isActive={pathname === '/dashboard'}
            >
              Dashboard
            </SidebarLink>

            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-white/60 uppercase">
              PRODUCTS
            </div>
            <SidebarLink 
              href="/dashboard/products/manage" 
              icon={Package}
              isActive={pathname === '/dashboard/products/manage'}
            >
              Manage Products
            </SidebarLink>

            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-white/60 uppercase">
              COURSES
            </div>
            <SidebarLink 
              href="/dashboard/courses/manage" 
              icon={Book}
              isActive={pathname === '/dashboard/courses/manage'}
            >
              Manage Courses
            </SidebarLink>

            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-white/60 uppercase">
              ORDERS
            </div>
            <SidebarLink 
              href="/dashboard/orders" 
              icon={ShoppingCart}
              isActive={pathname === '/dashboard/orders'}
            >
              All Orders
            </SidebarLink>
            <SidebarLink 
              href="/dashboard/notifications" 
              icon={Bell}
              isActive={pathname === '/dashboard/notifications'}
            >
              Notifications
            </SidebarLink>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 px-4 py-2.5">
                <div className="p-2 bg-white/10 rounded-full">
                  <User className="w-5 h-5 text-white" />
                </div>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                ) : userData ? (
                  <div>
                    <p className="text-sm font-medium text-white">
                      {userData.fullName || userData.email}
                    </p>
                    <p className="text-xs text-white/60">
                      {userData.isAdmin ? 'Admin' : 'User'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-white">Not signed in</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 w-full rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 