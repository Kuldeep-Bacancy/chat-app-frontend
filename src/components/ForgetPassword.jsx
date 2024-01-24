import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { forgetPassword } from '../services/users'
import { toast } from 'react-toastify'

function ForgetPassword() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const foregetPasswordHandler = async (data) => {
    try {
      const res = await forgetPassword(data)
      toast.success(res.data.message)
      reset()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot Your Password?
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(foregetPasswordHandler)}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  {...register('email', { required: 'Email is required!' })}
                />
                <p className='error'>{errors.email?.message}</p>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Reset Password
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Remember your password? <Link to="/login" className='font-medium text-primary-600 hover:underline dark:text-primary-500'>Sign In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgetPassword