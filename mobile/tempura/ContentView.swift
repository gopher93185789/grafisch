//
//  ContentView.swift
//  tempura
//
//  Created by jayac chhitu on 19/06/2025.
//

import SwiftUI


struct ContentView: View {
	let months = ["Apr", "May", "Jun"]

	var body: some View {
		VStack(spacing: 30) {
			Spacer().frame(height: 10)

			VStack(alignment: .leading, spacing: 6) {
				Text("Good morning, fnigga")
					.foregroundColor(.white)
					.font(.system(size: 30, weight: .semibold))
					.lineLimit(1)
					.multilineTextAlignment(.leading)

				Text("You have 30 classes and 10 assignments due today")
					.foregroundColor(Color.white.opacity(0.6))
					.font(.system(size: 18, weight: .medium))
					.lineLimit(2)
					.multilineTextAlignment(.leading)
			}
			.frame(maxWidth: .infinity, alignment: .leading)
			.padding(.horizontal, 16)
			// to get eah day attd check map location and from and to what time they is in scool location for and based on that incr/decr box op
			VStack {
				Text("Attendance")
					.foregroundColor(.white)
					.font(.system(size: 24, weight: .bold))
					.frame(maxWidth: .infinity, alignment: .leading)
					.padding(.horizontal, 16)

				ScrollView(.horizontal, showsIndicators: true) {
					HStack(spacing: 30) {
						ForEach(months, id: \.self) { month in
							VStack(spacing: 20) {
								LazyHGrid(rows: Array(repeating: GridItem(.fixed(20)), count: 7), spacing: 5) {
									ForEach(0..<7*4, id: \.self) { _ in
										Rectangle()
											.fill(Color.white.opacity(Double.random(in: 0.3...0.9)))
											.frame(width: 20, height: 20)
											.cornerRadius(5)
									}
								}
								
								Text(month)
									.foregroundColor(Color.white)
									.font(.system(size: 20, weight: .bold))
							}
						}
					}
					.padding(.horizontal, 20)
					.cornerRadius(20)
				
				}
			}
			.frame(maxWidth: .infinity, alignment: .topLeading)
			.background(Color.black)
		}.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading).background(Color.black)

			
	}
}



#Preview {
    ContentView()
}
