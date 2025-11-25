import { AppShell } from '@/components/layout/app-shell';
import { FirebaseClientProvider } from '@/firebase';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <FirebaseClientProvider><AppShell>{children}</AppShell></FirebaseClientProvider>;
}
