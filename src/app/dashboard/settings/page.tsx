"use client";

import { useEffect, useState } from "react";
import CompanyDetail from "@/app/components/CompanyDetail";
import { Company } from "@/app/types";
import { getCompanyById } from "@/app/actions/companies";
import { parseCookies } from "nookies";

const CompanyPage: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cookies = parseCookies();
  const { ["companyId"]: companyId } = parseCookies();

  useEffect(() => {
    const fetchCompany = async () => {
      const result = await getCompanyById(companyId);
      if ("company" in result) {
        setCompany(result.company);
      } else {
        setError(result.error);
      }
    };

    if (companyId) {
      fetchCompany();
    } else {
      setError("Company ID not found in cookies");
    }
  }, [companyId]);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return company ? (
    <CompanyDetail company={company} users={[]} />
  ) : (
    <div>Carregando...</div>
  );
};

export default CompanyPage;
