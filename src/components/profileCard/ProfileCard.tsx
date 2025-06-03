import Image from "next/image";

export function ProfileCard({
  user,
}: {
  user: {
    full_name: string;
    email: string;
    created_at: string;
    phone?: string;
    avatar_url?: string;
  };
}) {
  return (
    <div className='flex gap-4 space-y-4 p-4'>
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={`${user.full_name}'s avatar`}
          width={80}
          height={80}
          className='w-20 h-20 rounded-full object-cover'
        />
      ) : (
        <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm'>
          No Avatar
        </div>
      )}
      <div className='flex flex-col gap-2'>
        <div className='space-y-1'>
          <h2 className='text-2xl font-semibold'>
            {user.full_name || "Unknown User"}
          </h2>
          <p className='text-sm text-gray-500'>{user.email}</p>
        </div>
        <div className=' border-t pt-2 space-y-2 text-sm text-gray-700'>
          <p>
            <span className='font-medium'>Joined:</span>{" "}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
