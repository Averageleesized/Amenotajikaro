import svgPaths from "./svg-mi1x3u50n1";

function Battery() {
  return (
    <div className="absolute h-[11px] left-[55.5px] top-[3px] w-[23.5px]" data-name="Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 11">
        <g id="Battery">
          <path d={svgPaths.peb2780} fill="var(--fill-0, #FAF3DD)" id="Battery Shape" />
          <path d={svgPaths.p3b1400} fill="var(--fill-0, #2F2F2F)" id="Battery Fill" />
        </g>
      </svg>
    </div>
  );
}

function Wifi() {
  return (
    <div className="absolute bottom-[0.5px] h-[13px] left-[31.5px] w-[17px]" data-name="Wifi">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 13">
        <g id="Wifi">
          <path d={svgPaths.p2f6e65e0} fill="var(--fill-0, #2F2F2F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Signal() {
  return (
    <div className="absolute h-[14px] left-0 top-0 w-[23.5px]" data-name="Signal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 14">
        <g id="Signal">
          <path d={svgPaths.p3d6fca80} fill="var(--fill-0, #FAF3DD)" id="Vector" />
          <path d={svgPaths.pdfac900} fill="var(--fill-0, #2F2F2F)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[14.5px] right-[32px] top-[20px] w-[78.5px]" data-name="Frame">
      <Battery />
      <Wifi />
      <Signal />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="h-[56px] overflow-clip relative shrink-0 w-full" data-name="Status Bar">
      <p className="absolute font-['Shantell_Sans:Bold',sans-serif] font-bold leading-[normal] left-[51.5px] text-[#2f2f2f] text-[12px] text-center text-nowrap top-[17px] translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'BNCE' 0, 'INFM' 0, 'SPAC' 0" }}>
        8:00
      </p>
      <Frame />
    </div>
  );
}

function NavigationBar() {
  return (
    <div className="basis-0 grow min-h-px min-w-px overflow-clip relative shrink-0 w-full" data-name="Navigation Bar">
      <p className="[white-space-collapse:collapse] absolute font-['Nunito:Black',sans-serif] font-black leading-[normal] left-[197px] overflow-ellipsis overflow-hidden text-[#2f2f2f] text-[30.758px] text-center text-nowrap top-[6px] translate-x-[-50%] w-[244px]">Fantasy Tennis</p>
    </div>
  );
}

function HeaderNavigationBarWithTitle() {
  return (
    <div className="bg-[#ffc37c] content-stretch flex flex-col h-[104px] items-start overflow-clip relative shrink-0 w-full z-[2]" data-name="Header Navigation Bar With Title">
      <StatusBar />
      <NavigationBar />
    </div>
  );
}

function GestureIndicatorBar() {
  return (
    <div className="h-[32px] overflow-clip relative shrink-0 w-full" data-name="Gesture Indicator Bar">
      <div className="absolute bg-[rgba(0,0,0,0.05)] bottom-[8px] h-[4px] left-[calc(50%+0.5px)] rounded-[360px] translate-x-[-50%] w-[120px]" data-name="Rectangle" />
    </div>
  );
}

function BottomTabBar() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[4px] items-start overflow-clip pb-0 pt-[4px] px-0 relative shrink-0 w-full z-[1]" data-name="Bottom Tab Bar">
      <GestureIndicatorBar />
    </div>
  );
}

export default function WireFrameForAFantasyTennisLandingPageThePageWillHaveTheFollowingInfo1CoolHeroImage2HowToPlay3TodaysMatches4UpcomingTournaments5Leaderboard() {
  return (
    <div className="bg-[#ffc37c] relative size-full" data-name="Wire frame for a Fantasy Tennis landing page. The page will have the following Info: 1. Cool Hero Image 2. How to Play3. Today\'s Matches 4. Upcoming Tournaments5. Leaderboard">
      <div className="content-stretch flex flex-col isolate items-start min-h-inherit relative size-full">
        <HeaderNavigationBarWithTitle />
        <BottomTabBar />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#2f2f2f] border-solid inset-0 pointer-events-none" />
    </div>
  );
}