import HomeBanner from '@/components/home/banner/HomeBanner';
import HomeNotice from '@/components/home/notice/HomeNotice';
import HomeRanking from '@/components/home/ranking/HomeRanking';

export default function Home() {
  return (
    <div className="global-wrapper">
      <HomeBanner />
      <HomeNotice />
      <HomeRanking />
      {/*<HomeCommunity/> */}
    </div>
  );
}
