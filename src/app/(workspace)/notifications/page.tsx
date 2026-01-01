"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Notification,
  TickCircle,
  CloseCircle,
  InfoCircle,
  Danger,
  Receipt21,
  DocumentText,
  MoneyRecive,
  Timer1,
  ArrowLeft2,
  Trash,
  TickSquare,
  Clock,
} from "iconsax-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { formatDistanceToNow } from "date-fns";

interface NotificationItem {
  id: string;
  type: 'payment' | 'invoice' | 'reminder' | 'system' | 'info';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
  metadata?: Record<string, any>;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <MoneyRecive size={20} variant="Bold" color="#059669" />;
      case 'invoice':
        return <DocumentText size={20} variant="Bold" color="#14462a" />;
      case 'reminder':
        return <Timer1 size={20} variant="Bold" color="#D97706" />;
      case 'system':
        return <Danger size={20} variant="Bold" color="#DC2626" />;
      default:
        return <InfoCircle size={20} variant="Bold" color="#6B7280" />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft2 size={20} color="#65676B" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-[#14462a] text-white rounded-full px-2 py-0.5 text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">Stay updated with your account activity</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={markAllAsRead}
            >
              <TickSquare size={16} className="mr-2" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full ${filter === 'all' ? 'bg-[#14462a] hover:bg-[#14462a]/90' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full ${filter === 'unread' ? 'bg-[#14462a] hover:bg-[#14462a]/90' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Notification size={32} color="#B0B3B8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
          </h3>
          <p className="text-sm text-gray-500">
            {filter === 'unread' 
              ? "You've read all your notifications." 
              : "When something important happens, we'll let you know here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl p-5 transition-all hover:shadow-md ${
                !notification.read ? 'border-l-4 border-[#14462a]' : ''
              }`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'payment' ? 'bg-green-50' :
                  notification.type === 'invoice' ? 'bg-[#14462a]/10' :
                  notification.type === 'reminder' ? 'bg-amber-50' :
                  notification.type === 'system' ? 'bg-red-50' :
                  'bg-gray-100'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {notification.message}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <TickCircle size={16} color="#14462a" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-500"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Timestamp and Link */}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-xs text-[#14462a] font-medium hover:underline"
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
