from django.urls import path
from . import views

urlpatterns = [
    path('rides/', views.ride_list, name='ride_list'),
    path('rides/<int:pk>/', views.ride_detail, name='ride_detail'),
    path('stream/', views.stream_queue_updates, name='stream_queue_updates'),
    path('join/', views.join_queue, name='join_queue'),
    path('my-queue/', views.my_queue, name='my_queue'),
    path('leave/', views.leave_queue, name='leave_queue'),
    path('complete/', views.complete_queue, name='complete_queue'),
    path('history/', views.queue_history, name='queue_history'),
    path('stats/', views.queue_stats, name='queue_stats'),
    
    # Admin endpoints
    path('admin/live/', views.admin_live_view, name='admin_live_view'),
    path('admin/pause/<int:pk>/', views.admin_pause, name='admin_pause'),
    path('admin/resume/<int:pk>/', views.admin_resume, name='admin_resume'),
    path('admin/clear/<int:pk>/', views.admin_clear, name='admin_clear'),
    path('admin/board/<int:pk>/', views.admin_board, name='admin_board'),
    path('admin/rides/<int:pk>/update/', views.admin_update_ride, name='admin_update_ride'),
    
    path('restaurants/', views.restaurant_list, name='restaurant_list'),
    path('admin/restaurants/<int:pk>/update/', views.admin_update_restaurant, name='admin_update_restaurant'),
    
    path('admin/ticket-types/', views.admin_ticket_types, name='admin_ticket_types'),
    path('admin/ticket-types/<int:pk>/update/', views.admin_update_ticket_type, name='admin_update_ticket_type'),
    path('admin/system-config/', views.admin_system_config, name='admin_system_config'),
    
    path('admin/offers/create/', views.admin_create_offer, name='admin_create_offer'),
    path('admin/offers/<int:pk>/', views.admin_manage_offer, name='admin_manage_offer'),
    path('admin/broadcast-email/', views.admin_broadcast_email, name='admin_broadcast_email'),

    path('tickets/', views.get_tickets, name='get_tickets'),
    path('tickets/book/', views.book_ticket, name='book_ticket'),
    path('tickets/<int:pk>/cancel/', views.cancel_ticket, name='cancel_ticket'),
    path('notifications/', views.notifications_list, name='notifications_list'),
    path('offers/', views.get_offers, name='get_offers'),
    path('promo/validate/', views.validate_promo, name='validate_promo'),
    path('booking/create/', views.create_booking_order, name='create_booking_order'),
    path('booking/verify/', views.verify_booking_payment, name='verify_booking_payment'),
    path('booking/check-in/', views.scan_qr_checkin, name='scan_qr_checkin'),
    path('bookings/', views.get_user_bookings, name='get_user_bookings'),
    path('bookings/<str:booking_id>/resend-email/', views.resend_booking_email, name='resend_booking_email'),
    path('admin/payment-analytics/', views.admin_payment_analytics, name='admin_payment_analytics'),
    path('admin/transactions/', views.admin_transactions, name='admin_transactions'),
]
