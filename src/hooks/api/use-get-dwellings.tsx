import { useQuery } from "@tanstack/react-query";
import {
  getDwellingsAction,
  GetDwellingsActionProps,
} from "@/actions/dwelling/get-dwellings-action";

export const useGetDwellings = ({
  pagination: { offset, limit },
  sort: { field, order },
}: GetDwellingsActionProps) => {
  return useQuery({
    queryKey: ["get-dwellings", { offset, limit, field, order }],
    queryFn: () =>
      getDwellingsAction({
        pagination: { offset, limit },
        sort: { field, order },
      }),
  });
};
