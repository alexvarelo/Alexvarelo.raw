"use client";
import { AvailableApis } from "@/apis/apis";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import { Statistics } from "@/models/Statistics";
import { useState, useEffect } from "react";
import PopularPhotos from "./components/PopularPhotos";
import { Checks } from "../utils/checks";
import { NumberTicker } from "@/components/shared/NumberTicker";
import { useUserPhoto } from "@/contexts/UserPhotoContext";
import { CompaniesAnimatedCarousel } from "@/components/shared/CompaniesAnimatedCarousel";
import GradientText from "@/components/text/GradientText";
import { StatsLineChart } from "@/components/charts/StatsLineChart";

const Profile = () => {
  const [stats, setStats] = useState<Statistics>();
  const { user } = useUserPhoto();

  useEffect(() => {
    AvailableApis.fetchStats().then((result) => setStats(result));
  }, []);

  const combineStats = () => {
    if (
      !stats?.downloads?.historical?.values ||
      !stats?.views?.historical?.values
    ) {
      return [];
    }

    const downloadsData = stats.downloads.historical.values;
    const viewsData = stats.views.historical.values;

    // Create a map using date strings as keys for reliable lookup
    const downloadsByDate: { [key: string]: number } = {};

    downloadsData.forEach((item) => {
      if (item.date) {
        // Make sure we're using the date as a string
        const dateString = String(item.date);
        downloadsByDate[dateString] = item.value || 0;
      }
    });

    // Build the combined array
    const combinedStats: { views: number; downloads: number; date: Date }[] =
      [];

    viewsData.forEach((viewItem) => {
      if (viewItem.date) {
        // Make sure we're using the date as a string for lookup
        const dateString = String(viewItem.date);
        const downloads = downloadsByDate[dateString] || 0;

        combinedStats.push({
          views: viewItem.value || 0,
          downloads: downloads,
          date: new Date(viewItem.date),
        });
      }
    });

    return combinedStats;
  };

  return (
    <>
      <h2 className="text-5xl font-extrabold my-6 ml-2">
        <GradientText>.RAW </GradientText>
        STATISTICS
      </h2>

      <div className="stats stats-vertical lg:stats-horizontal flex flex-wrap justify-center shadow">
        <div className="stat flex-1 min-w-[250px] m-2">
          <div className="stat-figure">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Views</div>
          <div className="stat-value text-primary">
            <div className="stat-value text-red-400">
              <LoadingIndicator isLoading={Checks.isNil(stats)}>
                <NumberTicker value={stats?.views.total as number} />
              </LoadingIndicator>
            </div>
          </div>
          <div className="stat-desc">
            {stats?.views.historical.average} average per day
          </div>
        </div>

        <div className="stat flex-1 min-w-[250px] m-2">
          <div className="stat-figure">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total downloads</div>
          <div className="stat-value text-blue-600">
            <LoadingIndicator isLoading={Checks.isNil(stats)}>
              <NumberTicker value={stats?.downloads.total as number} />
            </LoadingIndicator>
          </div>
          <div className="stat-desc">
            {stats?.downloads.historical.average.toLocaleString()} average per
            day
          </div>
        </div>

        <div className="stat flex-1 min-w-[250px] m-2">
          <div className="stat-figure text-secondary">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img src={"/ProfileAvatar.png"} className="w-full h-auto" />
              </div>
            </div>
          </div>
          {/*TODO: This is wrong, needs to be updated*/}
          <div className="stat-title">Photos uploaded</div>
          <div className="stat-value text-green-400">{user?.total_photos}</div>
          <div className="stat-desc">alexvarelo.raw</div>
        </div>
      </div>
      <br />
      {/* {stats && <StatsLineChart chartData={combineStats()} />} */}
      <br />
      <CompaniesAnimatedCarousel />
      {/* <OrbitingCircles iconSize={40}>
          <Icons.figma />
          <Icons.buzzfeed />
          <Icons.googleSlides />
          <Icons.medium />
          <Icons.gitHub />
        </OrbitingCircles> */}

      <br />
      <PopularPhotos />
    </>
  );
};

export default Profile;
