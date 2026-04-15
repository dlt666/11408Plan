import { supabase, getOrCreateUserId } from '../utils/supabase'

// 测试Supabase连接
async function testSupabaseConnection() {
  console.log('=== 测试Supabase连接 ===')
  
  try {
    // 获取用户标识
    const userId = getOrCreateUserId()
    console.log('用户标识:', userId)
    
    // 测试连接
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.log('用户不存在，创建新用户...')
      // 创建新用户
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: userId,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        })
        .select()
        .single()
      
      if (createError) {
        console.error('创建用户失败:', createError)
      } else {
        console.log('创建用户成功:', newUser)
      }
    } else {
      console.log('用户存在:', data)
      // 更新最后登录时间
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId)
      
      if (updateError) {
        console.error('更新用户失败:', updateError)
      } else {
        console.log('更新用户成功')
      }
    }
    
    console.log('Supabase连接测试成功！')
  } catch (error) {
    console.error('Supabase连接测试失败:', error)
  }
}

testSupabaseConnection()
