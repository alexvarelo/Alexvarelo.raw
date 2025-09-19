"use client";
import { useGetUserStatistics } from "@/apis/generated/unsplashApi";
import { APP_CONFIG } from "@/constants/app";
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
  const { data: stats } = useGetUserStatistics(APP_CONFIG.unsplash.username);
  const { user } = useUserPhoto();

  const totalViews = stats?.views?.total || 0;
  const totalDownloads = stats?.downloads?.total || 0;

  return (
    <>
      <h2 className="md:text-5xl text-4xl font-extrabold my-6 ml-2">
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
              stroke="currentColor"
              className="w-7 h-7 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <div className="stat-title">Total Views</div>
          <div className="stat-value bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
            <LoadingIndicator isLoading={Checks.isNil(stats)}>
              <NumberTicker value={totalViews} />
            </LoadingIndicator>
          </div>
          <div className="stat-desc">
            {stats?.views?.historical?.average?.toLocaleString?.() ?? 0} average per day
          </div>
        </div>

        <div className="stat flex-1 min-w-[250px] m-2">
          <div className="stat-figure">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-7 h-7 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </div>
          <div className="stat-title">Total downloads</div>
          <div className="stat-value bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            <LoadingIndicator isLoading={Checks.isNil(stats)}>
              <NumberTicker value={totalDownloads} />
            </LoadingIndicator>
          </div>
          <div className="stat-desc">
            {stats?.downloads?.historical?.average?.toLocaleString?.() ?? 0} average per day
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
          <div className="stat-value bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">{user?.total_photos}</div>
          <div className="stat-desc">alexvarelo.raw</div>
        </div>
      </div>
      <br />
      {/* {stats && <StatsLineChart chartData={combineStats()} />} */}
      <br />
      <CompaniesAnimatedCarousel />

      <br />
      <PopularPhotos />
    </>
  );
};

export default Profile;
