import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileBottomBar from '../components/layout/MobileBottomBar';
import HelpChatBot from '../components/common/HelpChatBot';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar />
      <HelpChatBot />
    </div>
  );
}
