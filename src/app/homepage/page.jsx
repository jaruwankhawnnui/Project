
// "use client"
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import MainHeader from "@/components/MainHeader";

// const Home = () => {
//   const [data, setData] = useState(null);   
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   // Fetch data from API
//   useEffect(() => {
//     fetch('http://172.21.0.1:1337/api/cartadmins?populate=*')
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("API Response:", data);
//         setData(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   // const handleCardClick = async (item) => {
//   //   console.log("Item ID:", item.id); 
//   //   try {
//   //     // ส่งข้อมูลใหม่ไปยัง API
//   //     const response = await fetch('http://172.19.224.1:1337/api/cartadmins', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         data: {
//   //           Label: item.attributes?.Label|| '',
//   //           Category: item.attributes?.Category|| '',
//   //           image: item.attributes?.image?.data?.attributes?.url || null,
//   //         },
//   //       }),
//   //     });

//   //     if (response.ok) {
//   //       console.log('Item added successfully');
//   //       router.push('/inventory');  // หลังจากเพิ่มข้อมูลสำเร็จ ให้ไปยังหน้า InventoryList
//   //     } else {
//   //       const errorMessage = await response.text();
//   //       console.error('Failed to add item', errorMessage);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error adding item:', error);
//   //   }
//   // };

//   const handleCardClick = async (item) => {
//     console.log("Item clicked:", item);
//     console.log("Item ID:", item.id);
  
//     // Create query parameters for the GET request
//     const params = new URLSearchParams({
//       Label: item.attributes?.Label || '',
//       Category: item.attributes?.Category || '',
//       image: item.attributes?.image?.data?.id || null,  // Use ID instead of URL if image is a relation
//     }).toString();
  
//     const url = `http://172.20.64.1:1337/api/cartadmins?${params}&populate=*`;
//     console.log("URL to fetch:", url);
  
//     try {
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
  
//       const responseData = await response.json();  // log detailed response
//       console.log("API response:", responseData);
  
//       if (response.ok) {
//         console.log('Data fetched successfully');
//         router.push(`/card/${item.id}`);
//       } else {
//         console.error('Failed to fetch data', responseData);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };  

//   const renderItemsByCategory = () => {
//     return data.data.map((item, index) => (
//       <div 
//         key={index} 
//         className="relative bg-gray-200 rounded-lg p-4 w-48 mx-5 h-62 mt-10 mr-6 cursor-pointer flex flex-col items-center"
//         onClick={() => handleCardClick(item)}
//       >
//         {item.attributes?.image?.data?.attributes?.url && (
//           <img 
//             src={item.attributes.image.data.attributes.url} 
//             className="w-full h-36 object-cover mb-4 mt-1 rounded-lg" 
//             alt={item.attributes?.Label}
//           />
//         )}
//         <div className="text-center">
//           <div className="font-bold text-sm">{item.attributes?.Label}</div>
//           <div className="text-xs text-gray-500">{item.attributes?.Category}</div>
//         </div>
//       </div>
//     ));
//   };

//   return (
//     <div className='bg-gray-100 min-h-screen flex flex-col'>
//       <MainHeader />
//       <div className="flex justify-center items-start flex-wrap mt-0">
//         {renderItemsByCategory()}
//       </div>
//     </div>
//   );
// };

// export default Home;

// "use client"
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import MainHeader from "@/components/MainHeader";

// const Home = () => {
//   const { data: session, status } = useSession();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   // Fetch data from API
//   useEffect(() => {
//     fetch('http://172.21.0.1:1337/api/cartadmins?populate=*')
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("API Response:", data);
//         setData(data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);

//   // ส่งข้อมูลผู้ใช้ไปยัง Strapi API
//   useEffect(() => {
//     if (status === "authenticated" && session?.user) {
//       const studentID = session.user.Email.replace('@email.psu.ac.th', '');

//       const sendUserDataToAPI = async () => {
//         try {
//           const response = await fetch('http://172.21.0.1:1337/api/user-logins', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               data: {
//                 name: session.user.name,
//                 Email: session.user.email,
//                 student_id: studentID,
//               },
//             }),
//           });

//           if (response.ok) {
//             console.log('User data sent successfully');
//           } else {
//             console.error('Failed to send user data', await response.text());
//           }
//         } catch (error) {
//           console.error('Error sending user data:', error);
//         }
//       };

//       sendUserDataToAPI();
//     }
//   }, [status, session]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   const renderItemsByCategory = () => {
//     return data.data.map((item, index) => (
//       <div 
//         key={index} 
//         className="relative bg-gray-200 rounded-lg p-4 w-48 mx-5 h-62 mt-10 mr-6 cursor-pointer flex flex-col items-center"
//         onClick={() => handleCardClick(item)}
//       >
//         {item.attributes?.image?.data?.attributes?.url && (
//           <img 
//             src={item.attributes.image.data.attributes.url} 
//             className="w-full h-36 object-cover mb-4 mt-1 rounded-lg" 
//             alt={item.attributes?.Label}
//           />
//         )}
//         <div className="text-center">
//           <div className="font-bold text-sm">{item.attributes?.Label}</div>
//           <div className="text-xs text-gray-500">{item.attributes?.Category}</div>
//         </div>
//       </div>
//     ));
//   };

//   return (
//     <div className='bg-gray-100 min-h-screen flex flex-col'>
//       <MainHeader />
//       <div className="bg-white shadow-md p-4 w-full text-center mb-4">
//         {status === "authenticated" ? (
//           <div>
//             <p className="font-bold text-lg">Welcome: {session.user.name}</p>
//             <p className="text-gray-500">Email: {session.user.email}</p>
//             <p className="text-gray-500">Student ID: {session.user.email.replace('@email.psu.ac.th', '') || 'Not Available'}</p>
//           </div>
//         ) : (
//           <p className="text-gray-500">You are not logged in</p>
//         )}
//       </div>
//       <div className="flex justify-center items-start flex-wrap mt-0">
//         {renderItemsByCategory()}
//       </div>
//     </div>
//   );
// };

// export default Home;

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MainHeader from "@/components/MainHeader";

const Home = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserSaved, setIsUserSaved] = useState(false);
  const router = useRouter();

  // Fetch data from API
  useEffect(() => {
    fetch("http://172.20.160.1:1337/api/cartadmins?populate=*")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // ส่งข้อมูลผู้ใช้ไปยัง Strapi API
  useEffect(() => {
    if (status === "authenticated" && session?.user && !isUserSaved) {
      const studentID = session.user.email.replace("@email.psu.ac.th", "");

      const sendUserDataToAPI = async () => {
        try {
          // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
          const checkResponse = await fetch(
            `http://172.20.160.1:1337/api/user-logins?filters[Email][$eq]=${encodeURIComponent(
              session.user.email
            )}`
          );
          const checkData = await checkResponse.json();

          if (checkData.data && checkData.data.length > 0) {
            console.log("User already exists in Strapi:", checkData.data);
            setIsUserSaved(true); // ตั้งสถานะว่าผู้ใช้มีอยู่แล้ว
            return;
          }

          // หากไม่มีข้อมูลในระบบ ให้ทำการ POST เพื่อบันทึกข้อมูลใหม่
          const response = await fetch(
            "http://172.20.160.1:1337/api/user-logins",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  name: session.user.name,
                  Email: session.user.email,
                  student_id: studentID,
                },
              }),
            }
          );

          if (response.ok) {
            console.log("User data sent successfully");
            setIsUserSaved(true); // ตั้งสถานะว่าบันทึกเสร็จแล้ว
          } else {
            console.error("Failed to send user data", await response.text());
          }
        } catch (error) {
          console.error("Error sending user data:", error);
        }
      };

      sendUserDataToAPI();
    }
  }, [status, session, isUserSaved]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // ฟังก์ชันจัดการเมื่อคลิกอุปกรณ์
  const handleCardClick = (item) => {
    // เปลี่ยนเส้นทางไปยังหน้า Card พร้อมส่ง id ของอุปกรณ์
    router.push(`/card/${item.id}`);
  };

  // ฟังก์ชันแสดงรายการอุปกรณ์
  const renderItemsByCategory = () => {
    return data.data.map((item, index) => (
      <div
        key={index}
        className="relative bg-gray-200 rounded-lg p-4 w-48 mx-5 h-62 mt-10 mr-6 cursor-pointer flex flex-col items-center"
        onClick={() => handleCardClick(item)}
      >
        {item.attributes?.image?.data?.attributes?.url && (
          <img
            src={item.attributes.image.data.attributes.url}
            className="w-full h-36 object-cover mb-4 mt-1 rounded-lg"
            alt={item.attributes?.Label}
          />
        )}
        <div className="text-center">
          <div className="font-bold text-sm">{item.attributes?.Label}</div>
          <div className="text-xs text-gray-500">{item.attributes?.Category}</div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <MainHeader />
      <div className="bg-white shadow-md p-4 w-full text-center mb-4">
        {status === "authenticated" ? (
          <div>
            <p className="font-bold text-lg">Welcome: {session.user.name}</p>
            <p className="text-gray-500">Email: {session.user.email}</p>
            <p className="text-gray-500">
              Student ID:{" "}
              {session.user.email.replace("@email.psu.ac.th", "") ||
                "Not Available"}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">You are not logged in</p>
        )}
      </div>
      <div className="flex justify-center items-start flex-wrap mt-0">
        {renderItemsByCategory()}
      </div>
    </div>
  );
};

export default Home;
