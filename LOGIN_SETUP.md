# Ship Management System - Login Setup

## Sample User Credentials

Sistem ini memiliki dua tipe user: **Admin** dan **Vendor**

### Admin Login
- **Email**: `admin@company.com`
- **Password**: `admin123`
- **Akses**: Dashboard admin, master data, transaksi, budget realization, debit notes

### Vendor Login  
- **Email**: `vendor@marina.com`
- **Password**: `vendor123`
- **Akses**: Vendor portal (budget realization dan debit notes vendor)

## Setup Sample Users

Jalankan edge function untuk membuat sample users:

```javascript
const { data, error } = await supabase.functions.invoke('setup-sample-users');
```

Atau bisa diakses langsung melalui browser/curl untuk testing.

## Halaman-Halaman

### Admin Routes (Protected)
- `/` - Dashboard admin dengan statistik
- `/budget-realization` - Daftar semua budget realization  
- `/admin-debitnotes` - Daftar semua debit notes
- `/vendors` - Master data vendor (dengan tombol buat akun vendor)
- `/companies`, `/vessels`, `/budgets`, dll - Master data lainnya

### Vendor Routes (Protected)
- `/vendor-portal` - Dashboard vendor dengan 2 tab:
  - Budget Realization - monitoring budget
  - Debit Notes - daftar debit notes vendor

### Public Routes
- `/login` - Halaman login universal (auto-detect admin/vendor)

## Fitur Keamanan

1. **Row Level Security (RLS)**: Vendor hanya bisa lihat data mereka sendiri
2. **Input Validation**: Validasi client-side dan server-side dengan zod
3. **Auto-redirect**: Login otomatis redirect sesuai role
4. **Protected Routes**: Semua halaman memerlukan authentication

## Membuat Akun Vendor Baru

Admin bisa membuat akun vendor baru:
1. Login sebagai admin
2. Buka halaman `/vendors`
3. Klik icon "UserPlus" pada vendor yang ingin dibuatkan akun
4. Isi email dan password
5. Vendor bisa login menggunakan kredensial tersebut
