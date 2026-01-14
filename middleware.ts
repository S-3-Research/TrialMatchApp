import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/api(.*)', // <--- 重点：明确把 API 加入保护名单
  '/chat(.*)',
  // '/(.*)'  <--- 建议暂时注释掉这个，因为它太霸道了，容易误伤登录页
]);

// 开发阶段的简单密码保护
function checkDevPassword(req: Request): NextResponse | null {
  // 只在设置了 DEV_PASSWORD 环境变量时启用
  const devPassword = process.env.DEV_PASSWORD;
  if (!devPassword) return null;

  const authHeader = req.headers.get('authorization');
  
  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Development Access"',
      },
    });
  }

  const auth = authHeader.split(' ')[1];
  const [user, pass] = Buffer.from(auth, 'base64').toString().split(':');

  if (pass !== devPassword) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Development Access"',
      },
    });
  }

  return null;
}

export default clerkMiddleware(async (auth, req) => {
  // 先检查开发密码（如果设置了）
  const devPasswordResponse = checkDevPassword(req);
  if (devPasswordResponse) return devPasswordResponse;

  // 然后执行 Clerk 认证
  if (isProtectedRoute(req)) await auth.protect()
  console.log("Middleware is running for:", req.url);
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}