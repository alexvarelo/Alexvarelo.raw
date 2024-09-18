"use client";
import { AvailableApis } from "@/apis/apis";
import LoadingIndicator from "@/components/loading/LoadingIndicator";
import { Statistics } from "@/models/Statistics";
import { useState, useEffect } from "react";
import PopularPhotos from "./components/PopularPhotos";

const Profile = () => {
  const [stats, setStats] = useState<Statistics>();

  useEffect(() => {
    AvailableApis.fetchStats().then((result) => setStats(result));
  }, []);

  return (
    <>
      <h2 className="text-center text-2xl font-bold my-4">My stats</h2>

      <div className="stats shadow flex flex-wrap justify-center">
        <div className="stat flex-1 min-w-[250px] m-2">
          <div className="stat-figure text-primary">
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
            <LoadingIndicator value={stats?.views.total.toLocaleString()} />
          </div>
          <div className="stat-desc">
            {stats?.views.historical.average}% per day
          </div>
        </div>

        <div className="stat flex-1 min-w-[250px] m-2">
          <div className="stat-figure text-secondary">
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
            {stats?.downloads.total.toLocaleString()}
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
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          {/*TODO: This is wrong, needs to be updated*/}
          <div className="stat-value">{stats?.views.historical.quantity}</div>
          <div className="stat-title">Photos uploaded</div>
          <div className="stat-desc text-secondary">alexvarelo.raw</div>
        </div>
      </div>
      <br />
      <PopularPhotos />
    </>
  );
};

export default Profile;
