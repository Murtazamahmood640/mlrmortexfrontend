import React, { useState } from "react"
import { useEvents } from "../contexts/EventContext"
import { Search, Filter, Calendar, Users, Play, Download, Heart } from "lucide-react"
// import { Link } from "react-router-dom"

interface MediaItem {
  id: string
  eventId: string
  eventTitle: string
  type: "image" | "video"
  url: string
  caption: string
  uploadedOn: string
  category: string
}

const MediaGallery: React.FC = () => {
  const { events } = useEvents()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  // Mock media data based on events
  const mediaItems: MediaItem[] = events.flatMap((event) => [
    {
      id: `${event.id}-1`,
      eventId: event.id,
      eventTitle: event.title,
      type: "image",
      url: event.imageUrl,
      caption: `Highlights from ${event.title}`,
      uploadedOn: event.date,
      category: event.category,
    },
    {
      id: `${event.id}-2`,
      eventId: event.id,
      eventTitle: event.title,
      type: "image",
      url: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
      caption: `Behind the scenes - ${event.title}`,
      uploadedOn: event.date,
      category: event.category,
    },
    {
      id: `${event.id}-3`,
      eventId: event.id,
      eventTitle: event.title,
      type: "video",
      url: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
      caption: `Event recap - ${event.title}`,
      uploadedOn: event.date,
      category: event.category,
    },
  ])

  const filteredMedia = mediaItems.filter((item) => {
    const matchesSearch =
      item.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  const categories = ["all", "technical", "cultural", "sports", "academic", "workshop"]
  const types = ["all", "image", "video"]

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media)
  }

  const closeModal = () => {
    setSelectedMedia(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Media Gallery</h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore photos and videos from our college events and activities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-gray-800 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-gray-800 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-900 text-white">
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-gray-800 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {types.map((t) => (
                  <option key={t} value={t} className="bg-gray-900 text-white">
                    {t === "all" ? "All Media" : t.charAt(0).toUpperCase() + t.slice(1) + "s"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-400">{filteredMedia.length} items found</span>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer group border border-gray-800"
              onClick={() => handleMediaClick(media)}
            >
              <div className="relative">
                <img
                  src={media.url}
                  alt={media.caption}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {media.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                )}

                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      media.category === "technical"
                        ? "bg-blue-800 text-blue-200"
                        : media.category === "cultural"
                        ? "bg-purple-800 text-purple-200"
                        : media.category === "sports"
                        ? "bg-emerald-800 text-emerald-200"
                        : media.category === "academic"
                        ? "bg-indigo-800 text-indigo-200"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    {media.category.charAt(0).toUpperCase() + media.category.slice(1)}
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <button className="p-2 bg-black/40 rounded-full hover:bg-black/30 transition-all">
                    <Heart className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 line-clamp-1">{media.eventTitle}</h3>
                <p className="text-sm text-gray-300 mb-2 line-clamp-2">{media.caption}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-yellow-400" />
                    <span>{new Date(media.uploadedOn).toLocaleDateString()}</span>
                  </div>
                  <span className="capitalize">{media.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No media found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          </div>
        )}

        {/* Media Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-full flex flex-col bg-black/90 rounded-lg">
              <div className="flex items-start justify-between p-4 border-b border-gray-800">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedMedia.eventTitle}</h3>
                  <p className="text-sm text-gray-300">{selectedMedia.caption}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-black/30 hover:bg-black/20 transition" title="Download">
                    <Download className="h-5 w-5 text-white" />
                  </button>
                  <button className="p-2 rounded-full bg-black/30 hover:bg-black/20 transition" title="Like">
                    <Heart className="h-5 w-5 text-white" />
                  </button>
                  <button onClick={closeModal} className="p-2 rounded-full bg-black/30 hover:bg-black/20 transition">
                    <span className="text-white text-xl">×</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-4">
                {selectedMedia.type === "image" ? (
                  <img src={selectedMedia.url} alt={selectedMedia.caption} className="max-w-full max-h-[70vh] object-contain rounded" />
                ) : (
                  <div className="relative">
                    <img src={selectedMedia.url} alt={selectedMedia.caption} className="max-w-full max-h-[70vh] object-contain rounded opacity-95" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="p-4 rounded-full bg-yellow-500 hover:bg-yellow-600 transition">
                        <Play className="h-10 w-10 text-black" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-300">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-yellow-400" />
                    <span>{new Date(selectedMedia.uploadedOn).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{selectedMedia.type}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedMedia.category}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaGallery
