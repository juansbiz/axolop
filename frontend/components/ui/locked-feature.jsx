import { Lock, Calendar, Bell } from "lucide-react";
import { Button } from "./button";
import { FEATURE_ACCESS } from "@/lib/featureGating";

export function LockedFeature({ featureId, className = "" }) {
  const feature = FEATURE_ACCESS[featureId];

  if (!feature) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}
    >
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-[#101010]/10 to-[#101010]/10 flex items-center justify-center mb-6 shadow-lg">
          <Lock className="h-10 w-10 text-[#101010]" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {feature.name} - Coming Soon
        </h2>

        <p className="text-lg text-gray-600 mb-6">{feature.description}</p>

        {feature.roadmapETA && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#101010]/10 to-[#101010]/10 text-[#101010] font-semibold mb-8">
            <Calendar className="h-4 w-4" />
            <span>Expected Launch: {feature.roadmapETA}</span>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md p-8 mb-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            What to Expect
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#101010]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#101010] font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Full Task Tracking</p>
                <p className="text-sm text-gray-600">
                  Organize and manage tasks by project, status, and priority
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#101010]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#101010] font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Team Collaboration</p>
                <p className="text-sm text-gray-600">
                  Assign tasks, set deadlines, and track team progress
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#101010]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#101010] font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Smart Views</p>
                <p className="text-sm text-gray-600">
                  Multiple views including kanban, list, calendar, and timeline
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#101010]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#101010] font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Automation</p>
                <p className="text-sm text-gray-600">
                  Automated task creation, reminders, and status updates
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#101010] to-[#101010] hover:from-[#101010] hover:to-[#101010] text-white gap-2"
          >
            <Bell className="h-4 w-4" />
            Notify Me When Available
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            View Roadmap
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          This feature is currently in development and will be available to{" "}
          <span className="font-semibold text-[#101010]">
            Build, Scale, and God tier
          </span>{" "}
          subscribers in {feature.roadmapETA}.
        </p>
      </div>
    </div>
  );
}
