import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addNewVideo, fetchVideos } from "@/store/slices/video/video_slice";
import { Textarea } from "@/components/ui/textarea";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "@/store/slices/subscription/subscriptionSlice";
import { getUserPlaylists } from "@/store/slices/playlist/playlistSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.auth);
  const { subscribers, subscribedChannels } = useSelector(
    (state) => state.subscription
  );
  const { playlists, error } = useSelector((state) => state.playlist);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [newVideoFile, setNewVideoFile] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [activeTab, setActiveTab] = useState("videos");
  useEffect(() => {
    if (user) {
      dispatch(getUserPlaylists(user._id)); // ✅ Pass userId to action
    }
  }, [dispatch]);
  useEffect(() => {
    dispatch(fetchVideos(user._id)); // Load user data & videos with userId
  }, [dispatch, user._id]);

  const handleAddVideo = async () => {
    if (!newVideoTitle || !newVideoDescription)
      return alert("Please enter all details");
    dispatch(
      addNewVideo({
        title: newVideoTitle,
        description: newVideoDescription,
        thumbnail: newThumbnail,
        videoFile: newVideoFile,
      })
    );
    setNewVideoTitle("");
    setNewVideoDescription("");
  };
  useEffect(() => {
    dispatch(getUserChannelSubscribers(user._id));
    dispatch(getSubscribedChannels(user._id));
    console.log(
      subscribedChannels[0]?.channel,
      "this is the subscribed channel"
    );
  }, [dispatch, user._id]);
  const handleSubscription = (id) => {
    console.log(id, "this is the id");
    dispatch(toggleSubscription(id));
  };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* User Profile */}
          <Card>
            <div
              className="h-40 bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${user.coverImage})` }}
            ></div>
            <h2 className="p-2 text-xl font-bold">{user.fullName}'s Channel</h2>
            <CardContent className="flex items-center p-4">
              <img
                src={user.avatar}
                alt="User Profile"
                className="w-20 h-20 rounded-full border-4 border-white -mt-10"
              />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{user.username}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex mt-2 space-x-4">
                  <span className="text-sm text-gray-700">
                    <strong>{subscribers.length}</strong> Subscribers
                  </span>
                  <span className="text-sm text-gray-700">
                    <strong>{subscribedChannels.length}</strong> Subscribed
                    Channels
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList>
              <TabsTrigger value="add">Add Video</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="videos">All Videos</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="channels">Subscribed Channels</TabsTrigger>
            </TabsList>

            {/* All Videos */}
            <TabsContent value="videos">
              <h3 className="text-lg font-bold mt-4">Your Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {videos.length === 0 ? (
                  <p>No videos found.</p>
                ) : (
                  videos.map((video) => (
                    <Card key={video._id}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">{video.title}</h4>
                        <video className="w-full mt-2" controls>
                          <source src={video.videoFile} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            {/* All Playlists */}
            <TabsContent value="playlists">
              <h3 className="text-lg font-bold mt-4">Your Playlists</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {playlists.length === 0 ? (
                  <p>No Playlist found.</p>
                ) : (
                  playlists.map((playlist) => (
                    <Card key={playlist._id}>
                      <CardContent className="p-4">
                        <h1 className="font-semibold text-2xl">
                          <span className="font-bold">Title:</span>{" "}
                          {playlist.name}
                        </h1>
                        <h2 className="font-semibold text-lg">
                          <span className="font-bold">Descriptions:</span>{" "}
                          {playlist.description}
                        </h2>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            {/* All subscribers */}
            <TabsContent value="subscribers">
              <h3 className="text-lg font-bold mt-4">Your Subscribers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {subscribers.length === 0 ? (
                  <p>No subscribers found.</p>
                ) : (
                  subscribers.map((subscriber) => (
                    <Card key={subscriber._id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <img
                          src={subscriber.subscriber.avatar}
                          alt="User Profile"
                          className="w-20 h-20 rounded-full border-4 border-white "
                        />
                        <h1 className="font-semibold text-xl break-words">
                          <span className="font-bold">Email:</span>{" "}
                          {subscriber.subscriber.email}
                        </h1>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            {/* All subscribed Channel */}
            <TabsContent value="channels">
              <h3 className="text-lg font-bold mt-4">Subscribed Channels</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {subscribedChannels.length === 0 ? (
                  <p>No subscribers found.</p>
                ) : (
                  subscribedChannels.map((channel) => (
                    <Card
                      key={channel.channel?._id}
                      className="overflow-hidden"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center p-4 justify-between">
                          <img
                            src={channel?.channel?.avatar}
                            alt="User Profile"
                            className="w-20 h-20 rounded-full border-4 border-white "
                          />

                          <button
                            className={`flex mt-2 text-white rounded-2xl p-2 transition 
                                 bg-red-500 hover:bg-red-600                            `}
                            onClick={() =>
                              handleSubscription(channel?.channel._id)
                            }
                            disabled={loading}
                          >
                            {loading ? "Processing..." : "Un-Sub"}
                          </button>
                        </div>
                        <h1 className="font-semibold text-xl break-words">
                          <span className="font-bold">Email:</span>{" "}
                          {channel?.channel?.email}
                        </h1>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Add Video */}
            <TabsContent value="add">
              <h3 className="text-lg font-bold mt-4">Add New Video</h3>
              <Card className="mt-4">
                <CardContent className="p-4">
                  {/* Title Input */}
                  <div className="mt-2">
                    <label className="block font-medium">Upload Video</label>
                    <Input
                      type="text"
                      placeholder="Video Title"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  {/* Description Input */}
                  <div className="mt-2">
                    <label className="block font-medium">Upload Video</label>
                    <Textarea
                      placeholder="Video Description"
                      value={newVideoDescription}
                      onChange={(e) => setNewVideoDescription(e.target.value)}
                      className="w-full mt-2"
                    />
                  </div>
                  {/* Video File Upload */}
                  <div className="mt-2">
                    <label className="block font-medium">Upload Video</label>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setNewVideoFile(e.target.files[0])}
                      className="w-full mt-2"
                    />
                  </div>

                  {/* Thumbnail Upload */}
                  <div className="mt-2">
                    <label className="block font-medium">
                      Upload Thumbnail
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewThumbnail(e.target.files[0])}
                      className="w-full mt-2"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button onClick={handleAddVideo} className="mt-4 bg-gray-500">
                    Upload Video
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Dashboard;
