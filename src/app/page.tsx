"use client";

import { User, sendEmailVerification, signOut } from "firebase/auth";
import { auth, db, dbr, storage } from "../../firebase";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { ref } from "firebase/database";
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytes,
} from "firebase/storage";
import Image from "next/image";

export default function Home() {
  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }

  async function onVerifyEmail() {
    await sendEmailVerification(auth.currentUser as User);
    toast.success("Verification link has been sent to your email address");
  }

  const [createPostForm, createPostFormSet] = useState<{
    postMessage: string;
    postImgFile: FileList | undefined;
  }>({
    postMessage: "",
    postImgFile: undefined,
  });

  const [allPosts, allPostsSet] = useState<any[]>([]);

  async function getPosts() {
    try {
      const ref = collection(db, "post");
      const docs = await getDocs(ref);

      let sample = [];
      for (let x of docs.docs) {
        if (!x.exists()) return;
        sample.push(x.data());
      }
      allPostsSet(sample);
    } catch (error) {
      console.log(error);
    }
  }

  async function sendDataToDB(imgUrl?: string) {
    const ref = collection(db, "post");
    await addDoc(ref, {
      postMessage: createPostForm.postMessage,
      postImgUrl: imgUrl || "",
      ownerUID: auth.currentUser?.uid,
      createdAt: dayjs().format(),
    });
    createPostFormSet({
      postMessage: "",
      postImgFile: undefined,
    });
    await getPosts();
  }

  async function handleSendPost() {
    try {
      // console.log(createPostForm)
      if (createPostForm.postImgFile) {
        const storageRef = refStorage(
          storage,
          `/post/${createPostForm.postImgFile[0]?.name}`
        );
        await uploadBytes(storageRef, createPostForm.postImgFile[0]);
        const url = await getDownloadURL(storageRef);
        sendDataToDB(url);
      } else {
        // theres no image on the post
        sendDataToDB();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="mb-5 font-sans text-xl font-bold">Welcome {auth?.currentUser?.displayName}</h1>

      {!auth.currentUser?.emailVerified && (
        <div className="bg-yellow-500 p-4 cursor-pointer rounded-lg">
          <p onClick={onVerifyEmail} className="text-white">
            Please verify your email by clicking here
          </p>
        </div>
      )}

      <div className="flex flex-col items-end gap-4 bg-gray-100 p-4 rounded-lg shadow-md w-[500px] mb-3">
        <textarea
          onChange={({ target: { value } }) =>
            createPostFormSet((prev) => ({ ...prev, postMessage: value }))
          }
          value={createPostForm.postMessage}
          placeholder="What's happening?"
          className="text-black resize-none w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          onChange={(e) =>
            createPostFormSet((prev) => ({
              ...prev,
              postImgFile: e.target?.files as FileList,
            }))
          }
          id="post-upload"
          className="hidden"
          type="file"
        />
        {createPostForm.postImgFile && (
          <div className="preview-container">
            <img
              className="preview-image w-auto h-[100px] rounded-lg justify-center"
              src={URL.createObjectURL(createPostForm.postImgFile[0])}
              alt="Preview"
            />
          </div>
        )}
        <div className="flex justify-end items-center gap-4">
          <button
            onClick={() => document.getElementById("post-upload")?.click()}
            className="btn bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Upload Image
          </button>
          <button
            onClick={handleSendPost}
            className="btn bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-4 mt-6 w-full max-w-lg">
  {allPosts?.map((item, i) => (
    <div key={i} className="bg-white shadow-md rounded-xl p-4">
      <div className="flex items-center mb-2">
        <p className="text-xs text-gray-500">{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
      </div>
      {item?.postImgUrl && (
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <Image
            alt="img"
            className="w-full h-full object-cover rounded-lg"
            src={item?.postImgUrl}
            width={300}
            height={300}
          />
        </div>
      )}
      <h3 className="text-lg font-medium text-black">{item?.postMessage}</h3>
    </div>
  ))}
</div>



      <button
        className="btn bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 mt-6"
        onClick={handleSignOut}
      >
        Sign Out
      </button>

    </main>
  );
}