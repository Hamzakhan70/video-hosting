import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";
import { toggleSubscription } from "@/store/slices/subscription/subscriptionSlice";

export default function VideoModal({ video, isOpen, onClose, onLike }) {
  if (!video) return null;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { subscribedChannels, loading } = useSelector(
    (state) => state.subscription
  );
  const isSubscribed = subscribedChannels.includes(user._id);

  const handleSubscription = () => {
    dispatch(toggleSubscription(user._id));
  };
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
              className="w-full h-full rounded-lg"
            />
          </div>
          {/* User Profile */}
          <Card>
            <CardContent className="flex items-center p-4">
              <img
                src={user.avatar}
                alt="User Profile"
                className="w-20 h-20 rounded-full border-4"
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p>{user.email}</p>
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
