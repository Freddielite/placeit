import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { opportunityStatusStyle } from "@/utils/admin-status-style";
import { cn } from "@/utils/tailwind";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OpportunityTable({ data }: { data: any[] }) {
  return (
    <div className="hidden md:flex rounded-xl border border-gray-200 overflow-hidden bg-white">
      <Table>
        {/* Header */}
        <TableHeader>
          <TableRow className="bg-gray-100 uppercase text-xs text-gray-600 font-semibold">
            <TableHead className="px-4 py-4 text-left">Job Title</TableHead>
            <TableHead className="px-4 py-4 text-center w-32">Status</TableHead>
            <TableHead className="px-4 py-4 text-center w-32">
              Applicants
            </TableHead>
            <TableHead className="px-4 py-4 text-center w-32">Action</TableHead>
          </TableRow>
        </TableHeader>

        {/* Body */}
        <TableBody>
          {data.map((op) => (
            <TableRow
              key={op.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="px-4 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-gray-200 flex items-center justify-center text-sm">
                    🏢
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold leading-tight">
                      {op.title}
                    </h1>
                    <p className="text-xs text-gray-500">
                      {op.department ?? "Not specified"} &#8226; {op.location}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-4 py-5 text-center text-sm">
                <span
                  className={cn(
                    opportunityStatusStyle[
                      op.status as keyof typeof opportunityStatusStyle
                    ],
                  )}
                >
                  {op.status}
                </span>
              </TableCell>

              <TableCell className="px-4 py-5 text-center text-black/60  text-sm">
                {op.applicants ?? 0} Applicants
              </TableCell>

              <TableCell className="px-4 py-5 text-center">
                <Link
                  href={`opportunities/${op.id}`}
                  className="
                    inline-flex items-center gap-1.5
                    rounded-md border border-secondary 
                    px-3 py-2.5
                    text-xs font-medium
                    hover:opacity-90
                  "
                >
                  View
                  <ArrowRight size={14} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="px-4 py-3">
              {/* <p>pagination </p> */}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
