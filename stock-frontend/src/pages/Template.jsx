import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function Template() {
  return (
    <>
      <PageMeta
        title="Template | Stock Management"
        description="Template page"
      />
      <PageBreadcrumb pageTitle="Template" />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="text-gray-800 dark:text-white/90">
          Template page is working.
        </div>
      </div>
    </>
  );
}

