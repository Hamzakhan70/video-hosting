import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "@/store/slices/subscription/subscriptionSlice";

export default function VideoModal({ video, isOpen, onClose }) {
  if (!video) return null;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { subscribedChannels, loading } = useSelector(
    (state) => state.subscription
  );

  // Local state to ensure immediate UI update
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (video.owner?._id) {
      setIsSubscribed(
        subscribedChannels.some((sub) => sub.channel?._id === video.owner?._id)
      );
    }
  }, [isSubscribed, video.owner?._id]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserChannelSubscribers(user._id));
      dispatch(getSubscribedChannels(user._id));
    }
  }, [dispatch, user._id]);

  const handleSubscription = async () => {
    setIsSubscribed((prev) => !prev); // Optimistically update UI

    try {
      const response = await dispatch(
        toggleSubscription(video.owner._id)
      ).unwrap();

      if (response.success) {
        dispatch(getSubscribedChannels(user._id)); // Refresh actual data
      } else {
        setIsSubscribed((prev) => !prev); // Revert UI if API fails
      }
    } catch (error) {
      setIsSubscribed((prev) => !prev); // Revert UI in case of error
      console.error("Subscription toggle failed:", error);
    }
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
