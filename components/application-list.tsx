"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Download, Trash2, Search } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  getApplicationsAction,
  deleteApplicationAction,
  searchApplicationsAction,
} from "@/app/actions";
import { toast } from "sonner";

interface Application {
  id: string;
  nama_warga: string;
  tanggal_lahir: string;
  pekerjaan: string;
  status: string;
  created_at: string;
  tujuan: string;
}

export default function ApplicationList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const result = await getApplicationsAction();
      if (result.error) {
        toast.error(result.error);
      } else {
        setApplications(result.data || []);
      }
    } catch (error) {
      toast.error("Gagal memuat daftar pengajuan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("search", searchTerm);
      formData.append("status", statusFilter);

      const result = await searchApplicationsAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        setApplications(result.data || []);
      }
    } catch (error) {
      toast.error("Gagal mencari pengajuan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengajuan ini?")) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", id);

      await deleteApplicationAction(formData);
      setApplications(applications.filter((app) => app.id !== id));
      toast.success("Pengajuan berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus pengajuan");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Menunggu
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Disetujui
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Ditolak
          </Badge>
        );
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Cari berdasarkan nama, pekerjaan, atau tujuan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Cari
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum ada pengajuan
          </h3>
          <p className="text-gray-600">
            Belum ada pengajuan surat keterangan desa yang dibuat
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Nama Warga</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Pekerjaan</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {application.nama_warga}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(application.tanggal_lahir),
                      "dd MMM yyyy",
                      { locale: id }
                    )}
                  </TableCell>
                  <TableCell>{application.pekerjaan}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {application.tujuan}
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    {format(
                      new Date(application.created_at),
                      "dd MMM yyyy HH:mm",
                      { locale: id }
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(application.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
