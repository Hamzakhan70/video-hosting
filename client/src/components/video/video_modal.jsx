import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "@/store/slices/subscription/subscriptionSlice";

export default function VideoModal({ video, isOpen, onClose, onLike }) {
  if (!video) return null;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { subscribers, subscribedChannels, loading } = useSelector(
    (state) => state.subscription
  );
  const isSubscribed = subscribedChannels.includes(video.owner._id);

  const handleSubscription = () => {
    dispatch(toggleSubscription(video.owner._id));

    // dispatch(getSubscribedChannels(video.owner._id));
  };
  useEffect(() => {
    dispatch(getUserChannelSubscribers(user._id));
    console.log(subscribers, "subscribers");
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl text-white">
        <DialogTitle>{video.title}</DialogTitle>
        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative w-full aspect-video">
            <video
              src={video.videoFile}
              controls
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
          {/* User Profile */}
          <Card>
            <CardContent className="flex items-center p-4">
              <img
                src={video.owner.avatar}
                alt="User Profile"
                className="w-20 h-20 rounded-full border-4"
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{video.owner.username}</h2>
                <p>{video.owner.email}</p>
                <button
                  className={`flex mt-2 text-white rounded-2xl px-4 py-2 transition ${
                    isSubscribed
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  onClick={handleSubscription}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : isSubscribed
                    ? "Unsubscribe"
                    : "Subscribe"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
