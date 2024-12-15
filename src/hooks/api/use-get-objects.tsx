import { useQuery } from "@tanstack/react-query";
import {
  getObjectsAction,
  GetObjectsActionProps,
} from "@/actions/get-objects-action";

export const useGetObjects = ({
  pagination: { offset, limit },
  sort: { field, order },
}: GetObjectsActionProps) => {
  return useQuery({
    queryKey: ["get-objects", { offset, limit, field, order }],
    queryFn: () =>
      getObjectsAction({
        pagination: { offset, limit },
        sort: { field, order },
      }),
  });
};
