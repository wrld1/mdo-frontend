import { useQuery } from "@tanstack/react-query";
import {
  getObjectsAction,
  GetObjectsActionProps,
} from "@/actions/object/get-objects-action";

export const useGetObjects = ({
  pagination: { offset, limit },
  sort: { field, order },
  companyId,
}: GetObjectsActionProps) => {
  return useQuery({
    queryKey: ["get-objects", { offset, limit, field, order, companyId }],
    queryFn: async () => {
      const response = await getObjectsAction({
        pagination: { offset, limit },
        sort: { field, order },
        companyId,
      });

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
    },
    retry: false,
  });
};
