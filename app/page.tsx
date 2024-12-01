"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
type Project = {
  id: number;
  name: string;
  description: string;
};
const projects: Project[] = [
  {
    id: 1,
    name: "E-commerce Platform",
    description: "A full-featured online shopping platform with payment integration",
  },
  {
    id: 2,
    name: "Employee Dashboard",
    description: "Internal HR management system for employee data and performance tracking",
  },
  {
    id: 3,
    name: "Mobile Banking App",
    description: "Secure banking application for iOS and Android platforms",
  },
  {
    id: 4,
    name: "Learning Management System",
    description: "Educational platform for online course delivery and student tracking",
  },
  {
    id: 5,
    name: "Inventory Management",
    description: "Real-time inventory tracking system with barcode integration",
  },
  {
    id: 6,
    name: "Customer Support Portal",
    description: "Ticketing system with live chat and knowledge base features",
  },
  {
    id: 7,
    name: "Fleet Management System",
    description: "GPS-based vehicle tracking and maintenance scheduling platform",
  },
  {
    id: 8,
    name: "Healthcare Records System",
    description: "Electronic health records management with HIPAA compliance",
  },
  {
    id: 9,
    name: "Real Estate Marketplace",
    description: "Property listing and management platform with virtual tours",
  },
  {
    id: 10,
    name: "Social Media Analytics",
    description: "Dashboard for tracking and analyzing social media performance",
  },
  {
    id: 11,
    name: "Project 11",
    description: "Description for Project 11",
  },
  {
    id: 12,
    name: "Project 12",
    description: "Description for Project 12",
  },
  {
    id: 13,
    name: "Project 13",
    description: "Description for Project 13",
  },
];
export default function ProjectTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;
  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden border m-10 border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-900 to-blue-900">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Serial No.
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Project Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {currentProjects.map((project, index) => (
            <tr
              key={project.id}
              className={`hover:bg-blue-50 transition-colors duration-150 ease-in-out
                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                #{project.id.toString().padStart(3, '0')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{project.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600">{project.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg transition-colors duration-150 ease-in-out" onClick={() => router.push(`/details/${project.id}`)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, projects.length)} of {projects.length} projects
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {/* Single Page Number Display */}
            <span className="px-4 py-1 rounded-lg text-sm font-medium bg-blue-900 text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-900 hover:bg-blue-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}