//
//  home.swift
//  
//
//  Created by jayac chhitu on 21/06/2025.
//

import SwiftUI


struct ContentView: View {
    var body: some View {
        VStack{
            HStack (alignment: .center){
                Image("rizz")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 50, height: 50)
                    .clipShape(Circle())
                
                VStack(alignment: .leading){
                    Text("Joe Biden")
                        .font(.system(size: 20, weight: .bold))
                        .lineLimit(1)
                        .multilineTextAlignment(.leading)
                    
                    Text("student").font(.system(size: 15, weight: .semibold))
                        .lineLimit(1)
                        .multilineTextAlignment(.leading)
                        .opacity(0.5)
                }
                Spacer()
                
                Button(action: {
                    print("calender clicker")
                }){
                    Image(systemName: "calendar")
                        .font(.system(size: 20))
                        .foregroundColor(.black)
                        .frame(width: 50, height: 50)
                        .clipShape(Circle())
                        .overlay(
                            Circle()
                                .stroke(Color.black, lineWidth: 2).opacity(0.5)
                        )
                }


                
                
                Button(action: {
                    print("bell clicker")
                }){
                    Image(systemName: "bell")
                        .font(.system(size: 20))
                        .foregroundColor(.black)
                        .frame(width: 50, height: 50)
                        .clipShape(Circle())
                        .overlay(
                            Circle()
                                .stroke(Color.black, lineWidth: 2).opacity(0.5)
                        )
                }
            }.padding(.horizontal, 10)
            

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color("AppBackgroundColor").ignoresSafeArea())
    }
}



#Preview {
    ContentView()
}
