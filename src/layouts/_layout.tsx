import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import Logo from '@/components/ui/logo';
// import { BgImg } from '@/components/icons/bgImg';
import Button from '@/components/ui/button';
import { FlashIcon } from '@/components/icons/flash';
import { SearchFrom } from '@/components/search/view';
import SearchButton from '@/components/search/button';
import ActiveLink from '@/components/ui/links/active-link';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useDrawer } from '@/components/drawer-views/context';
import Hamburger from '@/components/ui/hamburger';
import { MenuItems } from '@/layouts/_layout-menu';
import WalletConnect from '@/components/nft/wallet-connect';

function NotificationButton() {
  return (
    <ActiveLink href="/notifications">
      <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-12 sm:w-12">
        <FlashIcon className="h-auto w-3 sm:w-auto" />
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-brand shadow-light sm:h-3 sm:w-3" />
      </div>
    </ActiveLink>
  );
}

function HeaderRightArea() {
  const isMounted = useIsMounted();
  const breakpoint = useBreakpoint();
  const { openDrawer, isOpen } = useDrawer();
  return (
    <div className="order-last flex shrink-0 items-center">
      {/* <div className="ltr:mr-3.5 rtl:ml-3.5 ltr:sm:mr-5 rtl:sm:ml-5 xl:hidden">
        <SearchButton
          color="white"
          className="shadow-main dark:border dark:border-solid dark:border-gray-700 dark:bg-light-dark dark:text-white"
        />
      </div> */}

      <div className="hidden gap-3 sm:gap-6 lg:flex lg:gap-8">
        {/* {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
          <div>
            <SearchButton variant="transparent" className="dark:text-white" />
          </div>
        )}
        <NotificationButton /> */}
        <WalletConnect />
      </div>

      <div className="flex items-center lg:hidden">
        {/* <NotificationButton /> */}
        <Hamburger
          isOpen={isOpen}
          onClick={() => openDrawer('DRAWER_MENU')}
          color="white"
          className="shadow-main ltr:ml-3.5 rtl:mr-3.5 dark:border dark:border-solid dark:border-gray-700 dark:bg-light-dark dark:text-white ltr:sm:ml-5 rtl:sm:mr-5"
        />
      </div>
    </div>
  );
}

export function Header() {
  const windowScroll = useWindowScroll();
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  const { openDrawer, isOpen } = useDrawer();

  return (
    <nav
      className={`myBox fixed top-0 z-30 flex w-full items-center justify-between px-4 transition-all duration-300 ltr:right-0 rtl:left-0 sm:px-6 lg:px-8 xl:px-10 3xl:px-12 ${
        // isMounted && windowScroll.y > 10
        'h-12 bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-[#161b1d] dark:to-[#161b1d]/80 sm:h-16'
        // : 'h-12 bg-body dark:bg-dark sm:h-20'
        // 'h-12  shadow-card backdrop-blur dark:bg-opacity-100 sm:h-16'
        // : 'h-12 bg-body dark:bg-dark sm:h-20'
      }`}
    >
      {/* <div className="w-80 2xl:w-[368px]"></div> */}
      <div className="flex items-center">
        <div className="hidden lg:mr-6 lg:block xl:hidden">
          <Hamburger
            isOpen={isOpen}
            onClick={() => openDrawer('DRAWER_MENU')}
            color="white"
            className="dark:bg-red-dark shadow-main dark:border dark:border-solid dark:border-gray-700 dark:text-white"
          />
        </div>
        <Logo />
        {isMounted && ['xs', 'sm', 'md', 'lg'].indexOf(breakpoint) == -1 && (
          <MenuItems />
        )}
      </div>

      <HeaderRightArea />
    </nav>
  );
}

interface LayoutProps {}

export default function Layout({
  children,
}: React.PropsWithChildren<LayoutProps>) {
  return (
    <div className="bg-light-100 flex min-h-screen w-full min-w-fit flex-col dark:bg-gradient-to-r dark:from-[#0f0f0e] dark:via-stone-900 dark:to-[#041112]">
      {/* <div className="min-w-fit w-full min-h-screen bg-light-100 dark:bg-gradient-to-r dark:from-[#0f0f0e] dark:via-stone-900 dark:to-[#041112] flex flex-col"> */}
      <div
      // className="bg-light-100 flex min-h-screen w-full min-w-fit flex-col bg-[#7F30FF]"
      // style={{ backgroundImage: BgImg }}
      >
        <Header />
        <main className="mx-auto mb-12 min-w-fit px-10 pt-16 sm:pt-24 ">
          {children}
        </main>
      </div>
    </div>
  );
}

// style={{background: 'linear-gradient(0.25turn, #161617, #19191a, #2a2a2e)'}}
// bg-gradient-to-r from-sky-700 via-indigo-800 to-indigo-900
// style={{border-image: 'linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c)'}}
// bg-gradient-to-r from-indigo-500 to-purple-500
// #323743
//  flex flex-grow flex-col

//? ? 'h-16 bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80 sm:h-20'
//? : 'h-16 bg-body dark:bg-dark sm:h-24'
